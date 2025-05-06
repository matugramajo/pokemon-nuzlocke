"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipos para las acciones
type CreateBattleData = {
  nuzlocke_id: string
  player1_id: string
  player2_id: string
  winner_id?: string
  location?: string
  notes?: string
  casualties?: string[] // Array de IDs de Pokémon
}

// Obtener todas las batallas de un nuzlocke
export async function getBattlesByNuzlocke(nuzlockeId: string) {
  const supabase = createServerClient()

  const { data: battles, error: battlesError } = await supabase
    .from("battles")
    .select(`
      *,
      player1:player1_id (
        id,
        name
      ),
      player2:player2_id (
        id,
        name
      ),
      winner:winner_id (
        id,
        name
      )
    `)
    .eq("nuzlocke_id", nuzlockeId)
    .order("battle_date", { ascending: false })

  if (battlesError) {
    console.error("Error fetching battles:", battlesError)
    throw new Error("Failed to fetch battles")
  }

  // Obtener las bajas para cada batalla
  const battlesWithCasualties = await Promise.all(
    battles.map(async (battle) => {
      const { data: casualties, error: casualtiesError } = await supabase
        .from("casualties")
        .select(`
          *,
          pokemon (
            id,
            nickname,
            species
          )
        `)
        .eq("battle_id", battle.id)

      if (casualtiesError) {
        console.error("Error fetching casualties:", casualtiesError)
        return battle
      }

      return {
        ...battle,
        casualties: casualties.map((c) => ({
          id: c.pokemon.id,
          nickname: c.pokemon.nickname,
          species: c.pokemon.species,
        })),
      }
    }),
  )

  return battlesWithCasualties
}

// Crear una nueva batalla
export async function createBattle(data: CreateBattleData) {
  const supabase = createServerClient()

  // 1. Crear la batalla
  const { data: battle, error: battleError } = await supabase
    .from("battles")
    .insert({
      nuzlocke_id: data.nuzlocke_id,
      player1_id: data.player1_id,
      player2_id: data.player2_id,
      winner_id: data.winner_id || null,
      location: data.location || null,
      notes: data.notes || null,
      battle_date: new Date().toISOString(),
    })
    .select()
    .single()

  if (battleError) {
    console.error("Error creating battle:", battleError)
    throw new Error("Failed to create battle")
  }

  // 2. Registrar las bajas si hay
  if (data.casualties && data.casualties.length > 0) {
    const casualties = data.casualties.map((pokemonId) => ({
      battle_id: battle.id,
      pokemon_id: pokemonId,
    }))

    const { error: casualtiesError } = await supabase.from("casualties").insert(casualties)

    if (casualtiesError) {
      console.error("Error registering casualties:", casualtiesError)
      throw new Error("Failed to register casualties")
    }

    // 3. Marcar los Pokémon como muertos
    for (const pokemonId of data.casualties) {
      const { error: updateError } = await supabase.from("pokemon").update({ is_alive: false }).eq("id", pokemonId)

      if (updateError) {
        console.error("Error marking pokemon as dead:", updateError)
        throw new Error("Failed to mark pokemon as dead")
      }
    }
  }

  // 4. Actualizar la fecha de última actualización del nuzlocke
  await supabase.from("nuzlockes").update({ last_updated: new Date().toISOString() }).eq("id", data.nuzlocke_id)

  revalidatePath(`/nuzlocke/${data.nuzlocke_id}`)
  return battle
}
