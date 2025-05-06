import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PlayerCardProps {
  name: string
  lives: number
  pokemonCount: number
  image: string
}

export function PlayerCard({ name, lives, pokemonCount, image }: PlayerCardProps) {
  return (
    <Card className="overflow-hidden border-2 border-pink-300 hover:shadow-xl transition-shadow">
      <CardHeader className="bg-pink-200 pb-2">
        <CardTitle className="text-center text-xl">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-300">
            <Image src={image || "/placeholder.svg?height=64&width=64"} alt={name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Vidas</span>
                <span className="text-sm font-medium">{lives}/3</span>
              </div>
              <Progress value={(lives / 3) * 100} className="h-2 bg-pink-100" />
            </div>
            <div className="flex justify-between text-sm">
              <span>Pokémon:</span>
              <span className="font-bold">{pokemonCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
