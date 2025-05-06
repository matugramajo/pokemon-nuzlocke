"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PlusCircle } from "lucide-react"

export function CreateNuzlockeButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [game, setGame] = useState("")
  const [players, setPlayers] = useState(["", "", ""])

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "El título es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (!game) {
      toast({
        title: "Error",
        description: "Debes seleccionar un juego",
        variant: "destructive",
      })
      return
    }

    if (!players[0].trim()) {
      toast({
        title: "Error",
        description: "Al menos un jugador es obligatorio",
        variant: "destructive",
      })
      return
    }

    // En una implementación real, aquí crearíamos el Nuzlocke en la base de datos
    // y obtendríamos un ID real
    const newNuzlockeId = Date.now().toString()

    toast({
      title: "Nuzlocke creado",
      description: `Tu Nuzlocke "${title}" ha sido creado correctamente`,
    })

    setOpen(false)

    // Redirigir al nuevo Nuzlocke
    router.push(`/nuzlocke/${newNuzlockeId}`)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Nuevo Nuzlocke
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Crear nuevo Nuzlocke</DialogTitle>
              <DialogDescription>Configura los detalles de tu nuevo desafío Nuzlocke</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Ej: Mi aventura en Galar"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="game">Juego</Label>
                <Select value={game} onValueChange={setGame}>
                  <SelectTrigger id="game">
                    <SelectValue placeholder="Selecciona un juego" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sword">Pokémon Sword</SelectItem>
                    <SelectItem value="shield">Pokémon Shield</SelectItem>
                    <SelectItem value="bdsp">Pokémon Brilliant Diamond / Shining Pearl</SelectItem>
                    <SelectItem value="arceus">Pokémon Legends: Arceus</SelectItem>
                    <SelectItem value="scarlet">Pokémon Scarlet</SelectItem>
                    <SelectItem value="violet">Pokémon Violet</SelectItem>
                    <SelectItem value="swsh">Pokémon Sword / Shield</SelectItem>
                    <SelectItem value="sm">Pokémon Sun / Moon</SelectItem>
                    <SelectItem value="usum">Pokémon Ultra Sun / Ultra Moon</SelectItem>
                    <SelectItem value="xy">Pokémon X / Y</SelectItem>
                    <SelectItem value="oras">Pokémon Omega Ruby / Alpha Sapphire</SelectItem>
                    <SelectItem value="bw">Pokémon Black / White</SelectItem>
                    <SelectItem value="bw2">Pokémon Black 2 / White 2</SelectItem>
                    <SelectItem value="hgss">Pokémon HeartGold / SoulSilver</SelectItem>
                    <SelectItem value="dpp">Pokémon Diamond / Pearl / Platinum</SelectItem>
                    <SelectItem value="rse">Pokémon Ruby / Sapphire / Emerald</SelectItem>
                    <SelectItem value="frlg">Pokémon FireRed / LeafGreen</SelectItem>
                    <SelectItem value="gsc">Pokémon Gold / Silver / Crystal</SelectItem>
                    <SelectItem value="rby">Pokémon Red / Blue / Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Jugadores</Label>
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <Input
                      key={index}
                      placeholder={`Jugador ${index + 1}`}
                      value={player}
                      onChange={(e) => handlePlayerChange(index, e.target.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Crear Nuzlocke</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
