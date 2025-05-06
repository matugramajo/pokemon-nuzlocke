"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trophy, Skull, ArrowRight } from "lucide-react"

// Datos de ejemplo para los Nuzlockes
const initialNuzlockes = [
  {
    id: "1",
    title: "Pokémon Sword Nuzlocke",
    game: "Pokémon Sword",
    startDate: "2023-01-15",
    status: "active",
    players: ["Matilde", "Jugador 2", "Jugador 3"],
    progress: "6/8 medallas",
    deaths: 4,
    lastUpdated: "2023-05-01",
  },
  {
    id: "2",
    title: "Pokémon Emerald Challenge",
    game: "Pokémon Emerald",
    startDate: "2022-10-05",
    status: "completed",
    players: ["Matilde", "Jugador 2"],
    progress: "Liga Pokémon completada",
    deaths: 7,
    lastUpdated: "2022-12-20",
  },
  {
    id: "3",
    title: "Pokémon FireRed Hardcore",
    game: "Pokémon FireRed",
    startDate: "2022-06-10",
    status: "failed",
    players: ["Matilde", "Jugador 3"],
    progress: "4/8 medallas",
    deaths: 12,
    lastUpdated: "2022-08-15",
  },
]

export function NuzlockeList() {
  const [nuzlockes] = useState(initialNuzlockes)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {nuzlockes.map((nuzlocke) => (
        <Card
          key={nuzlocke.id}
          className="border-2 border-pink-200 hover:border-pink-400 transition-all hover:shadow-lg"
        >
          <CardHeader className={`pb-2 ${getStatusColor(nuzlocke.status)}`}>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{nuzlocke.title}</CardTitle>
                <CardDescription>{nuzlocke.game}</CardDescription>
              </div>
              <Badge
                className={
                  nuzlocke.status === "active"
                    ? "bg-green-100 text-green-800 border-green-300"
                    : nuzlocke.status === "completed"
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-red-100 text-red-800 border-red-300"
                }
              >
                {getStatusText(nuzlocke.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>Iniciado: {new Date(nuzlocke.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="h-4 w-4 text-gray-500" />
                <span>{nuzlocke.progress}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Skull className="h-4 w-4 text-gray-500" />
                <span>{nuzlocke.deaths} Pokémon perdidos</span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Jugadores:</p>
                <div className="flex flex-wrap gap-1">
                  {nuzlocke.players.map((player) => (
                    <Badge key={player} variant="outline" className="bg-pink-50">
                      {player}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-xs text-gray-500">
              Última actualización: {new Date(nuzlocke.lastUpdated).toLocaleDateString()}
            </p>
            <Link href={`/nuzlocke/${nuzlocke.id}`}>
              <Button size="sm" variant="ghost" className="gap-1">
                Ver <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-50"
    case "completed":
      return "bg-blue-50"
    case "failed":
      return "bg-red-50"
    default:
      return "bg-gray-50"
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "active":
      return "Activo"
    case "completed":
      return "Completado"
    case "failed":
      return "Fallido"
    default:
      return status
  }
}
