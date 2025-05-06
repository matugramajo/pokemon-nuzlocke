import Link from "next/link"
import { NuzlockeList } from "@/components/nuzlocke-list"
import { CreateNuzlockeButton } from "@/components/create-nuzlocke-button"
import { getNuzlockes } from "@/lib/actions/nuzlocke"

export default async function Home() {
  // Obtener todos los nuzlockes de la base de datos
  const nuzlockes = await getNuzlockes()

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-pink-50">
      <header className="bg-pink-500 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Nuzlocke Tracker</h1>
          <nav>
            <Link href="/" className="px-3 py-2 rounded hover:bg-pink-600 transition-colors">
              Inicio
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Mis Nuzlockes</h2>
          <CreateNuzlockeButton />
        </div>

        <NuzlockeList nuzlockes={nuzlockes} />
      </main>

      <footer className="bg-pink-500 text-white p-4 text-center">
        <p>© {new Date().getFullYear()} Nuzlocke Tracker - Hecho con ❤️</p>
      </footer>
    </div>
  )
}
