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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { PlusCircle } from "lucide-react"
import { createNuzlocke } from "@/lib/actions/nuzlocke"

export function CreateNuzlockeButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState("")
  const [game, setGame] = useState("")
  const [description, setDescription] = useState("")
  const [players, setPlayers] = useState(["", "", ""])

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = value
    setPlayers(newPlayers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!title.trim()) {
        toast({
          title: "Error",
          description: "El título es obligatorio",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!game) {
        toast({
          title: "Error",
          description: "Debes seleccionar un juego",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!players[0].trim()) {
        toast({
          title: "Error",
          description: "Al menos un jugador es obligatorio",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Filtrar jugadores vacíos
      const filteredPlayers = players.filter((p) => p.trim() !== "")

      // Crear el nuzlocke en la base de datos
      const nuzlocke = await createNuzlocke({
        title,
        game,
        description,
        players: filteredPlayers,
      })

      toast({
        title: "Nuzlocke creado",
        description: `Tu Nuzlocke "${title}" ha sido creado correctamente`,
      })

      setOpen(false)

      // Redirigir al nuevo Nuzlocke
      router.push(`/nuzlocke/${nuzlocke.id}`)
    } catch (error) {
      console.error("Error creating nuzlocke:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el Nuzlocke. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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
                    <SelectItem value="Pokémon Sword">Pokémon Sword</SelectItem>
                    <SelectItem value="Pokémon Shield">Pokémon Shield</SelectItem>
                    <SelectItem value="Pokémon Brilliant Diamond">Pokémon Brilliant Diamond</SelectItem>
                    <SelectItem value="Pokémon Shining Pearl">Pokémon Shining Pearl</SelectItem>
                    <SelectItem value="Pokémon Legends: Arceus">Pokémon Legends: Arceus</SelectItem>
                    <SelectItem value="Pokémon Scarlet">Pokémon Scarlet</SelectItem>
                    <SelectItem value="Pokémon Violet">Pokémon Violet</SelectItem>
                    <SelectItem value="Pokémon Sun">Pokémon Sun</SelectItem>
                    <SelectItem value="Pokémon Moon">Pokémon Moon</SelectItem>
                    <SelectItem value="Pokémon Ultra Sun">Pokémon Ultra Sun</SelectItem>
                    <SelectItem value="Pokémon Ultra Moon">Pokémon Ultra Moon</SelectItem>
                    <SelectItem value="Pokémon X">Pokémon X</SelectItem>
                    <SelectItem value="Pokémon Y">Pokémon Y</SelectItem>
                    <SelectItem value="Pokémon Omega Ruby">Pokémon Omega Ruby</SelectItem>
                    <SelectItem value="Pokémon Alpha Sapphire">Pokémon Alpha Sapphire</SelectItem>
                    <SelectItem value="Pokémon Black">Pokémon Black</SelectItem>
                    <SelectItem value="Pokémon White">Pokémon White</SelectItem>
                    <SelectItem value="Pokémon Black 2">Pokémon Black 2</SelectItem>
                    <SelectItem value="Pokémon White 2">Pokémon White 2</SelectItem>
                    <SelectItem value="Pokémon HeartGold">Pokémon HeartGold</SelectItem>
                    <SelectItem value="Pokémon SoulSilver">Pokémon SoulSilver</SelectItem>
                    <SelectItem value="Pokémon Diamond">Pokémon Diamond</SelectItem>
                    <SelectItem value="Pokémon Pearl">Pokémon Pearl</SelectItem>
                    <SelectItem value="Pokémon Platinum">Pokémon Platinum</SelectItem>
                    <SelectItem value="Pokémon Ruby">Pokémon Ruby</SelectItem>
                    <SelectItem value="Pokémon Sapphire">Pokémon Sapphire</SelectItem>
                    <SelectItem value="Pokémon Emerald">Pokémon Emerald</SelectItem>
                    <SelectItem value="Pokémon FireRed">Pokémon FireRed</SelectItem>
                    <SelectItem value="Pokémon LeafGreen">Pokémon LeafGreen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe tu desafío Nuzlocke..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creando..." : "Crear Nuzlocke"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  )
}
