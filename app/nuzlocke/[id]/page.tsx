import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerCard } from "@/components/player-card"
import { PokemonList } from "@/components/pokemon-list"
import { BattleHistory } from "@/components/battle-history"
import { Rules } from "@/components/rules"
import { AddPokemonForm } from "@/components/add-pokemon-form"
import { NuzlockeHeader } from "@/components/nuzlocke-header"
import { getNuzlockeById } from "@/lib/actions/nuzlocke"
import { getPokemonByNuzlocke } from "@/lib/actions/pokemon"
import { getBattlesByNuzlocke } from "@/lib/actions/battles"
import { getRulesByNuzlocke } from "@/lib/actions/rules"

export default async function NuzlockePage({ params }: { params: { id: string } }) {
  const nuzlockeId = params.id

  // Obtener datos del nuzlocke y sus relaciones desde la base de datos
  const nuzlocke = await getNuzlockeById(nuzlockeId)
  const pokemon = await getPokemonByNuzlocke(nuzlockeId)
  const battles = await getBattlesByNuzlocke(nuzlockeId)
  const rules = await getRulesByNuzlocke(nuzlockeId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-50">
      <header className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Nuzlocke Tracker</h1>
          <nav className="flex gap-4">
            <Link href="/" className="px-3 py-2 rounded hover:bg-pink-600 transition-colors">
              Inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <NuzlockeHeader nuzlocke={nuzlocke} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {nuzlocke.players.map((player) => (
            <PlayerCard
              key={player.id}
              name={player.name}
              lives={player.lives}
              pokemonCount={pokemon.filter((p) => p.player_id === player.id && p.is_alive).length}
              image={player.image_url || "/placeholder.svg?height=100&width=100"}
            />
          ))}
        </div>

        <Tabs defaultValue="pokemon" className="bg-white rounded-lg shadow-lg p-4 mb-8">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="pokemon" className="data-[state=active]:bg-pink-200">
              Pokémon
            </TabsTrigger>
            <TabsTrigger value="battles" className="data-[state=active]:bg-pink-200">
              Batallas
            </TabsTrigger>
            <TabsTrigger value="rules" className="data-[state=active]:bg-pink-200">
              Reglas
            </TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-pink-200">
              Añadir Pokémon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pokemon">
            <PokemonList nuzlockeId={nuzlockeId} players={nuzlocke.players} pokemon={pokemon} />
          </TabsContent>

          <TabsContent value="battles">
            <BattleHistory nuzlockeId={nuzlockeId} battles={battles} players={nuzlocke.players} />
          </TabsContent>

          <TabsContent value="rules">
            <Rules nuzlockeId={nuzlockeId} rules={rules} />
          </TabsContent>

          <TabsContent value="add">
            <AddPokemonForm nuzlockeId={nuzlockeId} players={nuzlocke.players} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-pink-500 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Nuzlocke Tracker - Hecho con ❤️ para fans de Pokémon</p>
      </footer>
    </div>
  )
}
