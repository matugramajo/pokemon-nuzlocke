"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Plus, Trash2 } from "lucide-react"
import { createRule, deleteRule } from "@/lib/actions/rules"

interface RulesProps {
  nuzlockeId: string
  rules: {
    basic: any[]
    additional: any[]
    custom: any[]
  }
}

export function Rules({ nuzlockeId, rules }: RulesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ruleType, setRuleType] = useState<"basic" | "additional" | "custom">("basic")
  const [ruleText, setRuleText] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validación básica
      if (!ruleText.trim()) {
        toast({
          title: "Error",
          description: "El texto de la regla es obligatorio",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Crear la regla en la base de datos
      await createRule({
        nuzlocke_id: nuzlockeId,
        rule_text: ruleText,
        rule_type: ruleType,
      })

      toast({
        title: "Regla añadida",
        description: "La regla ha sido añadida correctamente",
      })

      // Resetear el formulario
      setRuleText("")
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Error creating rule:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir la regla. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await deleteRule(ruleId, nuzlockeId)

      toast({
        title: "Regla eliminada",
        description: "La regla ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error("Error deleting rule:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la regla. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const hasRules = rules.basic.length > 0 || rules.additional.length > 0 || rules.custom.length > 0

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reglas del Nuzlocke</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir Regla
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Añadir nueva regla</DialogTitle>
                <DialogDescription>Añade una nueva regla a tu desafío Nuzlocke</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ruleType">Tipo de regla</Label>
                  <Select
                    value={ruleType}
                    onValueChange={(value: "basic" | "additional" | "custom") => setRuleType(value)}
                  >
                    <SelectTrigger id="ruleType">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básica</SelectItem>
                      <SelectItem value="additional">Adicional</SelectItem>
                      <SelectItem value="custom">Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ruleText">Texto de la regla</Label>
                  <Textarea
                    id="ruleText"
                    placeholder="Describe la regla..."
                    value={ruleText}
                    onChange={(e) => setRuleText(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Añadiendo..." : "Añadir Regla"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasRules ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay reglas definidas todavía. Añade algunas reglas para tu Nuzlocke.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rules.basic.length > 0 && (
            <Card className="border-2 border-pink-200">
              <CardHeader className="bg-pink-100 pb-2">
                <CardTitle>Reglas Básicas</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="list-disc pl-5 space-y-2">
                  {rules.basic.map((rule) => (
                    <li key={rule.id} className="flex items-start group">
                      <span className="flex-1">{rule.rule_text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Eliminar regla</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {rules.additional.length > 0 && (
            <Card className="border-2 border-pink-200">
              <CardHeader className="bg-pink-100 pb-2">
                <CardTitle>Reglas Adicionales</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="list-disc pl-5 space-y-2">
                  {rules.additional.map((rule) => (
                    <li key={rule.id} className="flex items-start group">
                      <span className="flex-1">{rule.rule_text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Eliminar regla</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {rules.custom.length > 0 && (
            <Card className="border-2 border-pink-200">
              <CardHeader className="bg-pink-100 pb-2">
                <CardTitle>Reglas Personalizadas</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="list-disc pl-5 space-y-2">
                  {rules.custom.map((rule) => (
                    <li key={rule.id} className="flex items-start group">
                      <span className="flex-1">{rule.rule_text}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Eliminar regla</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      <Toaster />
    </div>
  )
}
