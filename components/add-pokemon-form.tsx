"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

const formSchema = z.object({
  player: z.string({
    required_error: "Por favor selecciona un jugador",
  }),
  pokemonName: z.string().min(1, {
    message: "El nombre del Pokémon es requerido",
  }),
  species: z.string().min(1, {
    message: "La especie del Pokémon es requerida",
  }),
  gender: z.string({
    required_error: "Por favor selecciona el género",
  }),
  level: z.coerce.number().min(1).max(100),
  ability: z.string().min(1, {
    message: "La habilidad es requerida",
  }),
  nature: z.string().min(1, {
    message: "La naturaleza es requerida",
  }),
  moves: z.string().min(1, {
    message: "Los movimientos son requeridos",
  }),
  rawData: z.string().optional(),
})

export function AddPokemonForm() {
  const [isParsingData, setIsParsingData] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player: "",
      pokemonName: "",
      species: "",
      gender: "",
      level: 1,
      ability: "",
      nature: "",
      moves: "",
      rawData: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Aquí se procesaría el envío del formulario
    console.log(values)
    toast({
      title: "Pokémon añadido",
      description: `${values.pokemonName} (${values.species}) ha sido añadido al equipo de ${values.player}`,
    })
    form.reset()
  }

  function parseRawData() {
    const rawData = form.getValues("rawData")
    if (!rawData) return

    setIsParsingData(true)

    try {
      // Ejemplo de parseo básico (esto se podría mejorar para ser más robusto)
      const nameMatch = rawData.match(/^([^\s]+)/)
      const speciesMatch = rawData.match(/$$([^)]+)$$/)
      const genderMatch = rawData.match(/$$([MF])$$/)
      const levelMatch = rawData.match(/Level: (\d+)/)
      const abilityMatch = rawData.match(/Ability: ([^\n]+)/)
      const natureMatch = rawData.match(/([A-Za-z]+) Nature/)

      // Extraer movimientos (las últimas 4 líneas antes de cualquier otra información)
      const moveLines = rawData.split("\n").slice(-4)
      const moves = moveLines.join(", ")

      if (nameMatch) form.setValue("pokemonName", nameMatch[1])
      if (speciesMatch) form.setValue("species", speciesMatch[1])
      if (genderMatch) form.setValue("gender", genderMatch[1])
      if (levelMatch) form.setValue("level", Number.parseInt(levelMatch[1]))
      if (abilityMatch) form.setValue("ability", abilityMatch[1])
      if (natureMatch) form.setValue("nature", natureMatch[1])
      form.setValue("moves", moves)

      toast({
        title: "Datos procesados",
        description: "Los datos han sido extraídos correctamente",
      })
    } catch (error) {
      toast({
        title: "Error al procesar",
        description: "No se pudieron extraer todos los datos. Por favor, completa el formulario manualmente.",
        variant: "destructive",
      })
    } finally {
      setIsParsingData(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Añadir Nuevo Pokémon</h2>

      <Card className="border-2 border-pink-200 mb-6">
        <CardHeader className="bg-pink-100 pb-2">
          <CardTitle>Datos en Bruto</CardTitle>
          <CardDescription>Pega los datos del Pokémon para procesarlos automáticamente</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="rawData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Datos del Pokémon</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Pega aquí los datos del Pokémon como en el ejemplo..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Ejemplo: ricardo (Thwackey) (M) IVs: 29 HP / 7 Atk / 19 Def...</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                onClick={parseRawData}
                disabled={isParsingData || !form.getValues("rawData")}
              >
                Procesar Datos
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-2 border-pink-200">
        <CardHeader className="bg-pink-100 pb-2">
          <CardTitle>Formulario de Pokémon</CardTitle>
          <CardDescription>Completa los detalles del nuevo Pokémon</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="player"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jugador</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un jugador" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Matilde">Matilde</SelectItem>
                          <SelectItem value="Jugador 2">Jugador 2</SelectItem>
                          <SelectItem value="Jugador 3">Jugador 3</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pokemonName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Pokémon</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especie</FormLabel>
                      <FormControl>
                        <Input placeholder="Especie (ej. Pikachu)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el género" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Masculino (M)</SelectItem>
                          <SelectItem value="F">Femenino (F)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habilidad</FormLabel>
                      <FormControl>
                        <Input placeholder="Habilidad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naturaleza</FormLabel>
                      <FormControl>
                        <Input placeholder="Naturaleza" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moves"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-2">
                      <FormLabel>Movimientos</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Movimientos separados por comas" {...field} />
                      </FormControl>
                      <FormDescription>
                        Ingresa los movimientos separados por comas (ej. Tackle, Growl, Ember)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full">
                Añadir Pokémon
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
