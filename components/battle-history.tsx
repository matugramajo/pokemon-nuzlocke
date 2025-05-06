"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Datos de ejemplo
const initialBattles = [
  {
    id: 1,
    date: "2023-05-01",
    player1: "Matilde",
    player2: "Jugador 2",
    winner: "Matilde",
    location: "Ciudad Luminalia",
    notes: "Batalla muy reñida, Ricardo venció a Sparky con un Razor Leaf crítico",
    casualties: ["Sparky (Pikachu)"],
  },
  {
    id: 2,
    date: "2023-05-03",
    player1: "Jugador 2",
    player2: "Jugador 3",
    winner: "Jugador 3",
    location: "Bosque Petalia",
    notes: "Blaze dominó toda la batalla con su velocidad superior",
    casualties: ["Fluffy (Wooloo)"],
  },
  {
    id: 3,
    date: "2023-05-05",
    player1: "Matilde",
    player2: "Jugador 3",
    winner: "Empate",
    location: "Gimnasio de Ciudad Férrica",
    notes: "Ambos equipos quedaron exhaustos después de una larga batalla",
    casualties: [],
  },
]

export function BattleHistory() {
  const [battles] = useState(initialBattles)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Historial de Batallas</h2>
      <ScrollArea className="h-[500px] pr-4">
        <div className="space-y-4">
          {battles.map((battle) => (
            <Card key={battle.id} className="border-2 border-pink-200">
              <CardHeader className="bg-pink-100 pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {battle.player1} vs {battle.player2}
                  </span>
                  <Badge
                    className={
                      battle.winner === "Empate"
                        ? "bg-yellow-200 text-yellow-800"
                        : battle.winner === "Matilde"
                          ? "bg-pink-200 text-pink-800"
                          : "bg-blue-200 text-blue-800"
                    }
                  >
                    {battle.winner === "Empate" ? "Empate" : `Ganador: ${battle.winner}`}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-medium">{new Date(battle.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ubicación</p>
                    <p className="font-medium">{battle.location}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500">Notas</p>
                  <p>{battle.notes}</p>
                </div>

                {battle.casualties.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bajas</p>
                    <div className="flex flex-wrap gap-2">
                      {battle.casualties.map((casualty, index) => (
                        <Badge key={index} variant="destructive">
                          {casualty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
