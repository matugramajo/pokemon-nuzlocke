"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Tipos para las acciones
type CreateRuleData = {
  nuzlocke_id: string
  rule_text: string
  rule_type: "basic" | "additional" | "custom"
}

// Obtener todas las reglas de un nuzlocke
export async function getRulesByNuzlocke(nuzlockeId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("nuzlocke_rules")
    .select("*")
    .eq("nuzlocke_id", nuzlockeId)
    .order("rule_type", { ascending: true })

  if (error) {
    console.error("Error fetching rules:", error)
    throw new Error("Failed to fetch rules")
  }

  // Agrupar reglas por tipo
  const groupedRules = {
    basic: data.filter((rule) => rule.rule_type === "basic"),
    additional: data.filter((rule) => rule.rule_type === "additional"),
    custom: data.filter((rule) => rule.rule_type === "custom"),
  }

  return groupedRules
}

// Crear una nueva regla
export async function createRule(data: CreateRuleData) {
  const supabase = createServerClient()

  const { data: rule, error } = await supabase
    .from("nuzlocke_rules")
    .insert({
      nuzlocke_id: data.nuzlocke_id,
      rule_text: data.rule_text,
      rule_type: data.rule_type,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating rule:", error)
    throw new Error("Failed to create rule")
  }

  revalidatePath(`/nuzlocke/${data.nuzlocke_id}`)
  return rule
}

// Eliminar una regla
export async function deleteRule(ruleId: string, nuzlockeId: string) {
  const supabase = createServerClient()

  const { error } = await supabase.from("nuzlocke_rules").delete().eq("id", ruleId)

  if (error) {
    console.error("Error deleting rule:", error)
    throw new Error("Failed to delete rule")
  }

  revalidatePath(`/nuzlocke/${nuzlockeId}`)
  return { success: true }
}
