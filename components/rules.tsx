import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Rules() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Reglas del Nuzlocke</h2>

      <div className="space-y-4">
        <Card className="border-2 border-pink-200">
          <CardHeader className="bg-pink-100 pb-2">
            <CardTitle>Reglas Básicas</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>Si un Pokémon se debilita, se considera muerto y debe ser liberado o almacenado permanentemente.</li>
              <li>
                Solo puedes capturar el primer Pokémon que encuentres en cada área. Si lo debilitas o fallas la captura,
                no tienes otra oportunidad.
              </li>
              <li>Debes poner un apodo a todos tus Pokémon para crear un vínculo más fuerte.</li>
              <li>Si todos tus Pokémon se debilitan, has perdido el desafío.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200">
          <CardHeader className="bg-pink-100 pb-2">
            <CardTitle>Reglas Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Cláusula de Duplicados: Si el primer Pokémon que encuentras ya lo has capturado (o su evolución), puedes
                ignorarlo y buscar otro.
              </li>
              <li>Cláusula de Especies: Solo puedes tener un Pokémon de cada línea evolutiva.</li>
              <li>Límite de Nivel: Tus Pokémon no pueden superar el nivel del próximo líder de gimnasio.</li>
              <li>Modo Set: No puedes cambiar de Pokémon cuando derrotas al Pokémon de un oponente.</li>
              <li>Límite de Objetos: Solo puedes usar 3 objetos por batalla.</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-2 border-pink-200">
          <CardHeader className="bg-pink-100 pb-2">
            <CardTitle>Reglas Personalizadas</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>Cada jugador tiene 3 vidas. Cuando todos tus Pokémon se debilitan, pierdes una vida.</li>
              <li>Las batallas entre jugadores son obligatorias cuando se encuentran en la misma ciudad.</li>
              <li>El ganador de una batalla puede elegir un Pokémon del perdedor para intercambiar.</li>
              <li>Si un Pokémon sobrevive con 1 PS, gana un bono de experiencia.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
