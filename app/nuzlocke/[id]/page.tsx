import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlayerCard } from "@/components/player-card"
import { PokemonList } from "@/components/pokemon-list"
import { BattleHistory } from "@/components/battle-history"
import { Rules } from "@/components/rules"
import { AddPokemonForm } from "@/components/add-pokemon-form"
import { NuzlockeHeader } from "@/components/nuzlocke-header"

export default function NuzlockePage({ params }: { params: { id: string } }) {
  // En una implementación real, aquí cargaríamos los datos del Nuzlocke específico
  // basándonos en el ID de la URL
  const nuzlockeId = params.id

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
        <NuzlockeHeader id={nuzlockeId} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PlayerCard name="Matilde" lives={3} pokemonCount={5} image="/placeholder.svg?height=100&width=100" />
          <PlayerCard name="Jugador 2" lives={2} pokemonCount={4} image="/placeholder.svg?height=100&width=100" />
          <PlayerCard name="Jugador 3" lives={3} pokemonCount={6} image="/placeholder.svg?height=100&width=100" />
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
            <PokemonList />
          </TabsContent>

          <TabsContent value="battles">
            <BattleHistory />
          </TabsContent>

          <TabsContent value="rules">
            <Rules />
          </TabsContent>

          <TabsContent value="add">
            <AddPokemonForm />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-pink-500 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Nuzlocke Tracker - Hecho con ❤️ para fans de Pokémon</p>
      </footer>
    </div>
  )
}
