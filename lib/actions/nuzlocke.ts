"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipos para las acciones
type CreateNuzlockeData = {
  title: string
  game: string
  description?: string
  players: string[]
}

type UpdateNuzlockeData = {
  id: string
  title?: string
  game?: string
  description?: string
  status?: string
}

// Obtener todos los nuzlockes
export async function getNuzlockes() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("nuzlockes")
    .select(`
      *,
      nuzlocke_players!inner (
        player_id,
        lives,
        players (
          id,
          name
        )
      )
    `)
    .order("last_updated", { ascending: false })

  if (error) {
    console.error("Error fetching nuzlockes:", error)
    throw new Error("Failed to fetch nuzlockes")
  }

  // Procesar los datos para agrupar jugadores por nuzlocke
  const processedData = data.reduce((acc, nuzlocke) => {
    const existingNuzlocke = acc.find((n) => n.id === nuzlocke.id)

    if (existingNuzlocke) {
      // Si ya existe el nuzlocke, añadir el jugador
      existingNuzlocke.players.push({
        id: nuzlocke.nuzlocke_players[0].players.id,
        name: nuzlocke.nuzlocke_players[0].players.name,
        lives: nuzlocke.nuzlocke_players[0].lives,
      })
    } else {
      // Si no existe, crear un nuevo nuzlocke con el jugador
      acc.push({
        ...nuzlocke,
        players: [
          {
            id: nuzlocke.nuzlocke_players[0].players.id,
            name: nuzlocke.nuzlocke_players[0].players.name,
            lives: nuzlocke.nuzlocke_players[0].lives,
          },
        ],
      })
    }

    return acc
  }, [])

  return processedData
}

// Obtener un nuzlocke específico por ID
export async function getNuzlockeById(id: string) {
  const supabase = createServerClient()

  const { data: nuzlocke, error: nuzlockeError } = await supabase.from("nuzlockes").select("*").eq("id", id).single()

  if (nuzlockeError) {
    console.error("Error fetching nuzlocke:", nuzlockeError)
    throw new Error("Failed to fetch nuzlocke")
  }

  const { data: nuzlockePlayers, error: playersError } = await supabase
    .from("nuzlocke_players")
    .select(`
      *,
      players (
        id,
        name,
        image_url
      )
    `)
    .eq("nuzlocke_id", id)

  if (playersError) {
    console.error("Error fetching nuzlocke players:", playersError)
    throw new Error("Failed to fetch nuzlocke players")
  }

  // Procesar los datos de jugadores
  const players = nuzlockePlayers.map((np) => ({
    id: np.players.id,
    name: np.players.name,
    image_url: np.players.image_url,
    lives: np.lives,
  }))

  return {
    ...nuzlocke,
    players,
  }
}

// Crear un nuevo nuzlocke
export async function createNuzlocke(data: CreateNuzlockeData) {
  const supabase = createServerClient()

  // Iniciar una transacción
  // 1. Crear el nuzlocke
  const { data: nuzlocke, error: nuzlockeError } = await supabase
    .from("nuzlockes")
    .insert({
      title: data.title,
      game: data.game,
      description: data.description || null,
      status: "active",
    })
    .select()
    .single()

  if (nuzlockeError) {
    console.error("Error creating nuzlocke:", nuzlockeError)
    throw new Error("Failed to create nuzlocke")
  }

  // 2. Crear o buscar jugadores y asociarlos al nuzlocke
  for (const playerName of data.players) {
    if (!playerName.trim()) continue

    // Buscar si el jugador ya existe
    const { data: existingPlayer, error: playerError } = await supabase
      .from("players")
      .select("id")
      .eq("name", playerName.trim())
      .maybeSingle()

    let playerId

    if (playerError) {
      console.error("Error checking player:", playerError)
      throw new Error("Failed to check player")
    }

    // Si el jugador no existe, crearlo
    if (!existingPlayer) {
      const { data: newPlayer, error: createPlayerError } = await supabase
        .from("players")
        .insert({
          name: playerName.trim(),
        })
        .select()
        .single()

      if (createPlayerError) {
        console.error("Error creating player:", createPlayerError)
        throw new Error("Failed to create player")
      }

      playerId = newPlayer.id
    } else {
      playerId = existingPlayer.id
    }

    // Asociar el jugador al nuzlocke
    const { error: associationError } = await supabase.from("nuzlocke_players").insert({
      nuzlocke_id: nuzlocke.id,
      player_id: playerId,
      lives: 3,
    })

    if (associationError) {
      console.error("Error associating player with nuzlocke:", associationError)
      throw new Error("Failed to associate player with nuzlocke")
    }
  }

  revalidatePath("/")
  return nuzlocke
}

// Actualizar un nuzlocke existente
export async function updateNuzlocke(data: UpdateNuzlockeData) {
  const supabase = createServerClient()

  const { data: updatedNuzlocke, error } = await supabase
    .from("nuzlockes")
    .update({
      ...(data.title && { title: data.title }),
      ...(data.game && { game: data.game }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status }),
      last_updated: new Date().toISOString(),
    })
    .eq("id", data.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating nuzlocke:", error)
    throw new Error("Failed to update nuzlocke")
  }

  revalidatePath(`/nuzlocke/${data.id}`)
  revalidatePath("/")
  return updatedNuzlocke
}

// Archivar un nuzlocke
export async function archiveNuzlocke(id: string) {
  return updateNuzlocke({
    id,
    status: "archived",
  })
}
