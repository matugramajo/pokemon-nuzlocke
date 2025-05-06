import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Creamos un cliente de Supabase para el servidor
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}
