"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Skull, ArrowRight } from "lucide-react"

type NuzlockeListProps = {
  nuzlockes: any[]
}

export function NuzlockeList({ nuzlockes }: NuzlockeListProps) {
  if (nuzlockes.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">No hay Nuzlockes todavía</h3>
        <p className="text-gray-500 mb-4">¡Crea tu primer Nuzlocke para comenzar a trackear tu aventura!</p>
      </div>
    )
  }

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
                <span>Iniciado: {new Date(nuzlocke.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Skull className="h-4 w-4 text-gray-500" />
                <span>Última actualización: {new Date(nuzlocke.last_updated).toLocaleDateString()}</span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Jugadores:</p>
                <div className="flex flex-wrap gap-1">
                  {nuzlocke.players.map((player) => (
                    <Badge key={player.id} variant="outline" className="bg-pink-50">
                      {player.name} ({player.lives} vidas)
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <p className="text-xs text-gray-500">
              {nuzlocke.description ? nuzlocke.description.substring(0, 50) + "..." : "Sin descripción"}
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
    case "archived":
      return "bg-gray-50"
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
    case "archived":
      return "Archivado"
    default:
      return status
  }
}
