"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createBattle } from "@/lib/actions/battles"
import { getPokemonByPlayer } from "@/lib/actions/pokemon"

interface BattleHistoryProps {
  nuzlockeId: string
  battles: any[]
  players: any[]
}

export function BattleHistory({ nuzlockeId, battles, players }: BattleHistoryProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [player1, setPlayer1] = useState("")
  const [player2, setPlayer2] = useState("")
  const [winner, setWinner] = useState("")
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [casualties, setCasualties] = useState<string[]>([])
  const [availablePokemon, setAvailablePokemon] = useState<any[]>([])

  const handlePlayerChange = async (playerId: string, playerNumber: number) => {
    if (playerNumber === 1) {
      setPlayer1(playerId)
      if (player2 === playerId) setPlayer2("")
    } else {
      setPlayer2(playerId)
      if (player1 === playerId) setPlayer1("")
    }

    // Cargar los Pokémon disponibles cuando se seleccionan ambos jugadores
    if ((playerNumber === 1 && player2) || (playerNumber === 2 && player1)) {
      try {
        const player1Pokemon = player1
          ? await getPokemonByPlayer(nuzlockeId, playerNumber === 1 ? playerId : player1)
          : []
        const player2Pokemon = player2
          ? await getPokemonByPlayer(nuzlockeId, playerNumber === 2 ? playerId : player2)
          : []

        setAvailablePokemon([...player1Pokemon, ...player2Pokemon])
      } catch (error) {
        console.error("Error loading pokemon:", error)
      }
    }
  }

  const handleCasualtyToggle = (pokemonId: string) => {
    setCasualties((prev) => (prev.includes(pokemonId) ? prev.filter((id) => id !== pokemonId) : [...prev, pokemonId]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!player1 || !player2) {
        toast({
          title: "Error",
          description: "Debes seleccionar ambos jugadores",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Crear la batalla en la base de datos
      await createBattle({
        nuzlocke_id: nuzlockeId,
        player1_id: player1,
        player2_id: player2,
        winner_id: winner || undefined,
        location: location || undefined,
        notes: notes || undefined,
        casualties: casualties,
      })

      toast({
        title: "Batalla registrada",
        description: "La batalla ha sido registrada correctamente",
      })

      // Resetear el formulario
      setPlayer1("")
      setPlayer2("")
      setWinner("")
      setLocation("")
      setNotes("")
      setCasualties([])
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating battle:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la batalla. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Historial de Batallas</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Registrar Batalla</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Registrar nueva batalla</DialogTitle>
                <DialogDescription>Ingresa los detalles de la batalla entre jugadores</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="player1">Jugador 1</Label>
                    <Select value={player1} onValueChange={(value) => handlePlayerChange(value, 1)}>
                      <SelectTrigger id="player1">
                        <SelectValue placeholder="Selecciona un jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="player2">Jugador 2</Label>
                    <Select value={player2} onValueChange={(value) => handlePlayerChange(value, 2)}>
                      <SelectTrigger id="player2">
                        <SelectValue placeholder="Selecciona un jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        {players.map((player) => (
                          <SelectItem key={player.id} value={player.id} disabled={player.id === player1}>
                            {player.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="winner">Ganador</Label>
                  <Select value={winner} onValueChange={setWinner}>
                    <SelectTrigger id="winner">
                      <SelectValue placeholder="Selecciona un ganador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tie">Empate</SelectItem>
                      {player1 && (
                        <SelectItem value={player1}>{players.find((p) => p.id === player1)?.name}</SelectItem>
                      )}
                      {player2 && (
                        <SelectItem value={player2}>{players.find((p) => p.id === player2)?.name}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Ubicación</Label>
                  <Input
                    id="location"
                    placeholder="Ej: Ciudad Luminalia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Detalles de la batalla..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
                {availablePokemon.length > 0 && (
                  <div className="grid gap-2">
                    <Label>Bajas</Label>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                      {availablePokemon.map((pokemon) => (
                        <div key={pokemon.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id={`pokemon-${pokemon.id}`}
                            checked={casualties.includes(pokemon.id)}
                            onCheckedChange={() => handleCasualtyToggle(pokemon.id)}
                          />
                          <label
                            htmlFor={`pokemon-${pokemon.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {pokemon.nickname} ({pokemon.species}) -{" "}
                            {players.find((p) => p.id === pokemon.player_id)?.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Registrando..." : "Registrar Batalla"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {battles.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No hay batallas registradas todavía.</p>
            </div>
          ) : (
            battles.map((battle) => (
              <Card key={battle.id} className="border-2 border-pink-200">
                <CardHeader className="bg-pink-100 pb-2">
                  <CardTitle className="flex justify-between items-center">
                    <span>
                      {battle.player1.name} vs {battle.player2.name}
                    </span>
                    <Badge
                      className={
                        !battle.winner
                          ? "bg-yellow-200 text-yellow-800"
                          : battle.winner.id === battle.player1.id
                            ? "bg-pink-200 text-pink-800"
                            : "bg-blue-200 text-blue-800"
                      }
                    >
                      {!battle.winner ? "Empate" : `Ganador: ${battle.winner.name}`}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-medium">{new Date(battle.battle_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-medium">{battle.location || "No especificada"}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Notas</p>
                    <p>{battle.notes || "Sin notas"}</p>
                  </div>

                  {battle.casualties?.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Bajas</p>
                      <div className="flex flex-wrap gap-2">
                        {battle.casualties.map((casualty, index) => (
                          <Badge key={index} variant="destructive">
                            {casualty.nickname} ({casualty.species})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
      <Toaster />
    </div>
  )
}
