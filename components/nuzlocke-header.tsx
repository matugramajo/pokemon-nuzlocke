"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { ArrowLeft, Edit, Calendar, Clock, MoreHorizontal, Archive, AlertTriangle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NuzlockeHeaderProps {
  id: string
}

export function NuzlockeHeader({ id }: NuzlockeHeaderProps) {
  // En una implementación real, cargaríamos los datos del Nuzlocke basados en el ID
  const [nuzlocke] = useState({
    id,
    title: "Pokémon Sword Nuzlocke",
    game: "Pokémon Sword",
    startDate: "2023-01-15",
    status: "active",
    description:
      "Nuestro desafío Nuzlocke en la región de Galar. Estamos siguiendo las reglas estándar con algunas modificaciones personalizadas.",
    lastUpdated: new Date().toISOString(),
  })

  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(nuzlocke.description)
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false)

  const handleSaveNotes = () => {
    // En una implementación real, guardaríamos las notas en la base de datos
    toast({
      title: "Notas actualizadas",
      description: "Las notas del Nuzlocke han sido actualizadas correctamente",
    })
    setIsEditingNotes(false)
  }

  const handleArchiveNuzlocke = () => {
    // En una implementación real, archivaríamos el Nuzlocke en la base de datos
    toast({
      title: "Nuzlocke archivado",
      description: "El Nuzlocke ha sido archivado correctamente",
    })
    setIsArchiveDialogOpen(false)
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" /> Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{nuzlocke.title}</h1>
        <Badge
          className={
            nuzlocke.status === "active"
              ? "bg-green-100 text-green-800 border-green-300"
              : nuzlocke.status === "completed"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-red-100 text-red-800 border-red-300"
          }
        >
          {nuzlocke.status === "active" ? "Activo" : nuzlocke.status === "completed" ? "Completado" : "Fallido"}
        </Badge>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Más opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingNotes(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Editar notas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsArchiveDialogOpen(true)}>
                <Archive className="h-4 w-4 mr-2" />
                Archivar Nuzlocke
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Card className="border-2 border-pink-200 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Iniciado: {new Date(nuzlocke.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                Última actualización: {new Date(nuzlocke.lastUpdated).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isEditingNotes ? (
            <div className="space-y-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas sobre este Nuzlocke..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingNotes(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSaveNotes}>
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <p>{nuzlocke.description}</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archivar Nuzlocke</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres archivar este Nuzlocke? Podrás acceder a él más tarde desde la sección de
              archivados.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-700">
              Esta acción no elimina el Nuzlocke, solo lo mueve a la sección de archivados.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsArchiveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleArchiveNuzlocke}>
              Archivar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
