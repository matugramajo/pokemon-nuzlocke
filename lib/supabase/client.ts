import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Creamos un cliente de Supabase para el cliente (navegador)
let client: ReturnType<typeof createBrowserClient> | null = null

export function createBrowserClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  client = createClient<Database>(supabaseUrl, supabaseKey)
  return client
}
