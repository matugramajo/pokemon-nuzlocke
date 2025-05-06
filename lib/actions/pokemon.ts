"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipos para las acciones
type CreatePokemonData = {
  nuzlocke_id: string
  player_id: string
  nickname: string
  species: string
  gender?: string
  level: number
  ability?: string
  nature?: string
  moves?: string[]
  ivs?: {
    hp?: number
    atk?: number
    def?: number
    spa?: number
    spd?: number
    spe?: number
  }
  evs?: {
    hp?: number
    atk?: number
    def?: number
    spa?: number
    spd?: number
    spe?: number
  }
  dynamax_level?: number
}

// Obtener todos los Pokémon de un nuzlocke
export async function getPokemonByNuzlocke(nuzlockeId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pokemon")
    .select(`
      *,
      players (
        id,
        name
      )
    `)
    .eq("nuzlocke_id", nuzlockeId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pokemon:", error)
    throw new Error("Failed to fetch pokemon")
  }

  return data
}

// Obtener todos los Pokémon de un jugador en un nuzlocke
export async function getPokemonByPlayer(nuzlockeId: string, playerId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pokemon")
    .select("*")
    .eq("nuzlocke_id", nuzlockeId)
    .eq("player_id", playerId)
    .eq("is_alive", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pokemon:", error)
    throw new Error("Failed to fetch pokemon")
  }

  return data
}

// Crear un nuevo Pokémon
export async function createPokemon(data: CreatePokemonData) {
  const supabase = createServerClient()

  const { data: pokemon, error } = await supabase
    .from("pokemon")
    .insert({
      nuzlocke_id: data.nuzlocke_id,
      player_id: data.player_id,
      nickname: data.nickname,
      species: data.species,
      gender: data.gender || null,
      level: data.level,
      ability: data.ability || null,
      nature: data.nature || null,
      moves: data.moves || null,
      iv_hp: data.ivs?.hp || null,
      iv_atk: data.ivs?.atk || null,
      iv_def: data.ivs?.def || null,
      iv_spa: data.ivs?.spa || null,
      iv_spd: data.ivs?.spd || null,
      iv_spe: data.ivs?.spe || null,
      ev_hp: data.evs?.hp || null,
      ev_atk: data.evs?.atk || null,
      ev_def: data.evs?.def || null,
      ev_spa: data.evs?.spa || null,
      ev_spd: data.evs?.spd || null,
      ev_spe: data.evs?.spe || null,
      dynamax_level: data.dynamax_level || 0,
      is_alive: true,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating pokemon:", error)
    throw new Error("Failed to create pokemon")
  }

  // Actualizar la fecha de última actualización del nuzlocke
  await supabase.from("nuzlockes").update({ last_updated: new Date().toISOString() }).eq("id", data.nuzlocke_id)

  revalidatePath(`/nuzlocke/${data.nuzlocke_id}`)
  return pokemon
}

// Marcar un Pokémon como muerto
export async function markPokemonAsDead(pokemonId: string, nuzlockeId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("pokemon")
    .update({ is_alive: false })
    .eq("id", pokemonId)
    .select()
    .single()

  if (error) {
    console.error("Error marking pokemon as dead:", error)
    throw new Error("Failed to mark pokemon as dead")
  }

  // Actualizar la fecha de última actualización del nuzlocke
  await supabase.from("nuzlockes").update({ last_updated: new Date().toISOString() }).eq("id", nuzlockeId)

  revalidatePath(`/nuzlocke/${nuzlockeId}`)
  return data
}
