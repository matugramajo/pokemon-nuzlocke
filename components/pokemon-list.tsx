"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { markPokemonAsDead } from "@/lib/actions/pokemon"

interface PokemonListProps {
  nuzlockeId: string
  players: any[]
  pokemon: any[]
}

export function PokemonList({ nuzlockeId, players, pokemon }: PokemonListProps) {
  const [selectedPokemon, setSelectedPokemon] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Agrupar Pokémon por jugador
  const pokemonByPlayer = players.reduce((acc, player) => {
    acc[player.id] = pokemon.filter((p) => p.player_id === player.id)
    return acc
  }, {})

  const handleMarkAsDead = async () => {
    if (!selectedPokemon) return

    setIsSubmitting(true)
    try {
      await markPokemonAsDead(selectedPokemon.id, nuzlockeId)

      toast({
        title: "Pokémon marcado como muerto",
        description: `${selectedPokemon.nickname} (${selectedPokemon.species}) ha sido marcado como muerto`,
      })
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error marking pokemon as dead:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al marcar el Pokémon como muerto. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Tabs defaultValue={players[0]?.id}>
        <TabsList className="grid grid-cols-3 mb-6">
          {players.map((player) => (
            <TabsTrigger key={player.id} value={player.id} className="data-[state=active]:bg-pink-200">
              {player.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {players.map((player) => (
          <TabsContent key={player.id} value={player.id}>
            <h2 className="text-2xl font-bold mb-4">Equipo de {player.name}</h2>

            {!pokemonByPlayer[player.id] || pokemonByPlayer[player.id].length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No hay Pokémon registrados para este jugador.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pokemonByPlayer[player.id]?.map((poke) => (
                  <Card
                    key={poke.id}
                    className={`border-2 ${poke.is_alive ? "border-pink-200 hover:border-pink-400" : "border-gray-200 bg-gray-50 opacity-70"} transition-colors`}
                  >
                    <CardHeader className="bg-pink-100 pb-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {poke.nickname} ({poke.species})
                            {!poke.is_alive && <Badge variant="destructive">Muerto</Badge>}
                          </CardTitle>
                          <CardDescription>
                            Nivel {poke.level} • {poke.gender === "M" ? "♂️" : poke.gender === "F" ? "♀️" : ""}
                          </CardDescription>
                        </div>
                        <div className="w-16 h-16 relative">
                          <Image
                            src="/placeholder.svg?height=64&width=64"
                            alt={poke.species}
                            width={64}
                            height={64}
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Habilidad</p>
                          <p className="font-medium">{poke.ability || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Naturaleza</p>
                          <p className="font-medium">{poke.nature || "N/A"}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Movimientos</p>
                        <div className="flex flex-wrap gap-2">
                          {poke.moves?.map((move, index) => (
                            <Badge key={index} variant="outline" className="bg-pink-50">
                              {move}
                            </Badge>
                          )) || <span className="text-gray-400">Sin movimientos</span>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">IVs</p>
                          <div className="text-xs grid grid-cols-2 gap-x-2">
                            <p>HP: {poke.iv_hp || 0}</p>
                            <p>Atk: {poke.iv_atk || 0}</p>
                            <p>Def: {poke.iv_def || 0}</p>
                            <p>SpA: {poke.iv_spa || 0}</p>
                            <p>SpD: {poke.iv_spd || 0}</p>
                            <p>Spe: {poke.iv_spe || 0}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">EVs</p>
                          <div className="text-xs grid grid-cols-2 gap-x-2">
                            <p>HP: {poke.ev_hp || 0}</p>
                            <p>Atk: {poke.ev_atk || 0}</p>
                            <p>Def: {poke.ev_def || 0}</p>
                            <p>SpA: {poke.ev_spa || 0}</p>
                            <p>SpD: {poke.ev_spd || 0}</p>
                            <p>Spe: {poke.ev_spe || 0}</p>
                          </div>
                        </div>
                      </div>

                      {poke.is_alive && (
                        <div className="mt-4 flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              setSelectedPokemon(poke)
                              setIsDialogOpen(true)
                            }}
                          >
                            Marcar como muerto
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marcar Pokémon como muerto</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres marcar a {selectedPokemon?.nickname} ({selectedPokemon?.species}) como
              muerto? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleMarkAsDead} disabled={isSubmitting}>
              {isSubmitting ? "Procesando..." : "Marcar como muerto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
