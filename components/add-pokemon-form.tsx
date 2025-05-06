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
import { createPokemon } from "@/lib/actions/pokemon"

const formSchema = z.object({
  player_id: z.string({
    required_error: "Por favor selecciona un jugador",
  }),
  nickname: z.string().min(1, {
    message: "El nombre del Pokémon es requerido",
  }),
  species: z.string().min(1, {
    message: "La especie del Pokémon es requerida",
  }),
  gender: z.string().optional(),
  level: z.coerce.number().min(1).max(100),
  ability: z.string().optional(),
  nature: z.string().optional(),
  moves: z.string().optional(),
  iv_hp: z.coerce.number().min(0).max(31).optional(),
  iv_atk: z.coerce.number().min(0).max(31).optional(),
  iv_def: z.coerce.number().min(0).max(31).optional(),
  iv_spa: z.coerce.number().min(0).max(31).optional(),
  iv_spd: z.coerce.number().min(0).max(31).optional(),
  iv_spe: z.coerce.number().min(0).max(31).optional(),
  ev_hp: z.coerce.number().min(0).max(252).optional(),
  ev_atk: z.coerce.number().min(0).max(252).optional(),
  ev_def: z.coerce.number().min(0).max(252).optional(),
  ev_spa: z.coerce.number().min(0).max(252).optional(),
  ev_spd: z.coerce.number().min(0).max(252).optional(),
  ev_spe: z.coerce.number().min(0).max(252).optional(),
  dynamax_level: z.coerce.number().min(0).max(10).optional(),
  rawData: z.string().optional(),
})

interface AddPokemonFormProps {
  nuzlockeId: string
  players: any[]
}

export function AddPokemonForm({ nuzlockeId, players }: AddPokemonFormProps) {
  const [isParsingData, setIsParsingData] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      player_id: "",
      nickname: "",
      species: "",
      gender: "",
      level: 1,
      ability: "",
      nature: "",
      moves: "",
      iv_hp: 0,
      iv_atk: 0,
      iv_def: 0,
      iv_spa: 0,
      iv_spd: 0,
      iv_spe: 0,
      ev_hp: 0,
      ev_atk: 0,
      ev_def: 0,
      ev_spa: 0,
      ev_spd: 0,
      ev_spe: 0,
      dynamax_level: 0,
      rawData: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Procesar los movimientos
      const moves = values.moves ? values.moves.split(",").map((move) => move.trim()) : []

      // Crear el Pokémon en la base de datos
      await createPokemon({
        nuzlocke_id: nuzlockeId,
        player_id: values.player_id,
        nickname: values.nickname,
        species: values.species,
        gender: values.gender,
        level: values.level,
        ability: values.ability,
        nature: values.nature,
        moves: moves,
        ivs: {
          hp: values.iv_hp,
          atk: values.iv_atk,
          def: values.iv_def,
          spa: values.iv_spa,
          spd: values.iv_spd,
          spe: values.iv_spe,
        },
        evs: {
          hp: values.ev_hp,
          atk: values.ev_atk,
          def: values.ev_def,
          spa: values.ev_spa,
          spd: values.ev_spd,
          spe: values.ev_spe,
        },
        dynamax_level: values.dynamax_level,
      })

      toast({
        title: "Pokémon añadido",
        description: `${values.nickname} (${values.species}) ha sido añadido al equipo`,
      })
      form.reset()
    } catch (error) {
      console.error("Error creating pokemon:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al añadir el Pokémon. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
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

      // Extraer IVs
      const ivsMatch = rawData.match(/IVs: ([^\n]+)/)
      if (ivsMatch) {
        const ivsParts = ivsMatch[1].split("/")
        ivsParts.forEach((part) => {
          const [stat, value] = part.trim().split(" ")
          if (stat && value) {
            if (stat.includes("HP")) form.setValue("iv_hp", Number.parseInt(value))
            if (stat.includes("Atk")) form.setValue("iv_atk", Number.parseInt(value))
            if (stat.includes("Def")) form.setValue("iv_def", Number.parseInt(value))
            if (stat.includes("SpA")) form.setValue("iv_spa", Number.parseInt(value))
            if (stat.includes("SpD")) form.setValue("iv_spd", Number.parseInt(value))
            if (stat.includes("Spe")) form.setValue("iv_spe", Number.parseInt(value))
          }
        })
      }

      // Extraer EVs
      const evsMatch = rawData.match(/EVs: ([^\n]+)/)
      if (evsMatch) {
        const evsParts = evsMatch[1].split("/")
        evsParts.forEach((part) => {
          const [stat, value] = part.trim().split(" ")
          if (stat && value) {
            if (stat.includes("HP")) form.setValue("ev_hp", Number.parseInt(value))
            if (stat.includes("Atk")) form.setValue("ev_atk", Number.parseInt(value))
            if (stat.includes("Def")) form.setValue("ev_def", Number.parseInt(value))
            if (stat.includes("SpA")) form.setValue("ev_spa", Number.parseInt(value))
            if (stat.includes("SpD")) form.setValue("ev_spd", Number.parseInt(value))
            if (stat.includes("Spe")) form.setValue("ev_spe", Number.parseInt(value))
          }
        })
      }

      // Extraer movimientos (las últimas 4 líneas antes de cualquier otra información)
      const moveLines = rawData.split("\n").slice(-4)
      const moves = moveLines.join(", ")

      if (nameMatch) form.setValue("nickname", nameMatch[1])
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
      console.error("Error parsing data:", error)
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
                {isParsingData ? "Procesando..." : "Procesar Datos"}
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
                  name="player_id"
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
                          {players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nickname"
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

                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">IVs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <FormField
                      control={form.control}
                      name="iv_hp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HP</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="31" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iv_atk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atk</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="31" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iv_def"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Def</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="31" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iv_spa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SpA</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="31" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iv_spd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SpD</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="31" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="iv_spe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spe</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="31" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-lg font-semibold mb-2">EVs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                    <FormField
                      control={form.control}
                      name="ev_hp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>HP</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="252" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ev_atk"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atk</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="252" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ev_def"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Def</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="252" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ev_spa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SpA</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="252" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ev_spd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SpD</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="252" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ev_spe"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spe</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" max="252" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="dynamax_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel de Dynamax</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Añadiendo..." : "Añadir Pokémon"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
