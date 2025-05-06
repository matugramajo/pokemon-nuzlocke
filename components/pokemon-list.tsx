"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo
const initialPokemon = {
  Matilde: [
    {
      id: 1,
      name: "Ricardo",
      species: "Thwackey",
      gender: "M",
      level: 18,
      ability: "Overgrow",
      nature: "Naughty",
      moves: ["Scratch", "Razor Leaf", "Branch Poke", "Double Hit"],
      ivs: { hp: 29, atk: 7, def: 19, spa: 18, spd: 7, spe: 25 },
      evs: { hp: 4, atk: 8, def: 4, spa: 3, spd: 11, spe: 16 },
      dynamaxLevel: 0,
    },
    {
      id: 2,
      name: "Luna",
      species: "Wooloo",
      gender: "F",
      level: 15,
      ability: "Fluffy",
      nature: "Calm",
      moves: ["Tackle", "Defense Curl", "Rollout", "Double Kick"],
      ivs: { hp: 20, atk: 15, def: 25, spa: 10, spd: 22, spe: 18 },
      evs: { hp: 6, atk: 2, def: 8, spa: 0, spd: 10, spe: 4 },
      dynamaxLevel: 0,
    },
  ],
  "Jugador 2": [
    {
      id: 1,
      name: "Sparky",
      species: "Pikachu",
      gender: "M",
      level: 17,
      ability: "Static",
      nature: "Jolly",
      moves: ["Thunder Shock", "Quick Attack", "Double Team", "Electro Ball"],
      ivs: { hp: 22, atk: 20, def: 15, spa: 25, spd: 18, spe: 30 },
      evs: { hp: 0, atk: 10, def: 0, spa: 8, spd: 0, spe: 12 },
      dynamaxLevel: 0,
    },
  ],
  "Jugador 3": [
    {
      id: 1,
      name: "Blaze",
      species: "Charmander",
      gender: "M",
      level: 16,
      ability: "Blaze",
      nature: "Adamant",
      moves: ["Scratch", "Ember", "Dragon Breath", "Metal Claw"],
      ivs: { hp: 24, atk: 28, def: 16, spa: 20, spd: 15, spe: 26 },
      evs: { hp: 0, atk: 12, def: 4, spa: 0, spd: 0, spe: 14 },
      dynamaxLevel: 0,
    },
  ],
}

export function PokemonList() {
  const [pokemon] = useState(initialPokemon)

  return (
    <Tabs defaultValue="Matilde">
      <TabsList className="grid grid-cols-3 mb-6">
        <TabsTrigger value="Matilde" className="data-[state=active]:bg-pink-200">
          Matilde
        </TabsTrigger>
        <TabsTrigger value="Jugador 2" className="data-[state=active]:bg-pink-200">
          Jugador 2
        </TabsTrigger>
        <TabsTrigger value="Jugador 3" className="data-[state=active]:bg-pink-200">
          Jugador 3
        </TabsTrigger>
      </TabsList>

      {Object.keys(pokemon).map((player) => (
        <TabsContent key={player} value={player}>
          <h2 className="text-2xl font-bold mb-4">Equipo de {player}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pokemon[player].map((poke) => (
              <Card key={poke.id} className="border-2 border-pink-200 hover:border-pink-400 transition-colors">
                <CardHeader className="bg-pink-100 pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        {poke.name} ({poke.species})
                      </CardTitle>
                      <CardDescription>
                        Nivel {poke.level} • {poke.gender === "M" ? "♂️" : "♀️"}
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
                      <p className="font-medium">{poke.ability}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Naturaleza</p>
                      <p className="font-medium">{poke.nature}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Movimientos</p>
                    <div className="flex flex-wrap gap-2">
                      {poke.moves.map((move, index) => (
                        <Badge key={index} variant="outline" className="bg-pink-50">
                          {move}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">IVs</p>
                      <div className="text-xs grid grid-cols-2 gap-x-2">
                        <p>HP: {poke.ivs.hp}</p>
                        <p>Atk: {poke.ivs.atk}</p>
                        <p>Def: {poke.ivs.def}</p>
                        <p>SpA: {poke.ivs.spa}</p>
                        <p>SpD: {poke.ivs.spd}</p>
                        <p>Spe: {poke.ivs.spe}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">EVs</p>
                      <div className="text-xs grid grid-cols-2 gap-x-2">
                        <p>HP: {poke.evs.hp}</p>
                        <p>Atk: {poke.evs.atk}</p>
                        <p>Def: {poke.evs.def}</p>
                        <p>SpA: {poke.evs.spa}</p>
                        <p>SpD: {poke.evs.spd}</p>
                        <p>Spe: {poke.evs.spe}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
