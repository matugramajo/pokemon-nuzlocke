export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      nuzlockes: {
        Row: {
          id: string
          title: string
          game: string
          description: string | null
          status: string
          start_date: string
          last_updated: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          game: string
          description?: string | null
          status?: string
          start_date?: string
          last_updated?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          game?: string
          description?: string | null
          status?: string
          start_date?: string
          last_updated?: string
          created_at?: string
        }
      }
      players: {
        Row: {
          id: string
          name: string
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image_url?: string | null
          created_at?: string
        }
      }
      nuzlocke_players: {
        Row: {
          id: string
          nuzlocke_id: string
          player_id: string
          lives: number
          created_at: string
        }
        Insert: {
          id?: string
          nuzlocke_id: string
          player_id: string
          lives?: number
          created_at?: string
        }
        Update: {
          id?: string
          nuzlocke_id?: string
          player_id?: string
          lives?: number
          created_at?: string
        }
      }
      pokemon: {
        Row: {
          id: string
          nuzlocke_id: string
          player_id: string
          nickname: string
          species: string
          gender: string | null
          level: number
          ability: string | null
          nature: string | null
          moves: string[] | null
          iv_hp: number | null
          iv_atk: number | null
          iv_def: number | null
          iv_spa: number | null
          iv_spd: number | null
          iv_spe: number | null
          ev_hp: number | null
          ev_atk: number | null
          ev_def: number | null
          ev_spa: number | null
          ev_spd: number | null
          ev_spe: number | null
          dynamax_level: number | null
          is_alive: boolean
          created_at: string
        }
        Insert: {
          id?: string
          nuzlocke_id: string
          player_id: string
          nickname: string
          species: string
          gender?: string | null
          level?: number
          ability?: string | null
          nature?: string | null
          moves?: string[] | null
          iv_hp?: number | null
          iv_atk?: number | null
          iv_def?: number | null
          iv_spa?: number | null
          iv_spd?: number | null
          iv_spe?: number | null
          ev_hp?: number | null
          ev_atk?: number | null
          ev_def?: number | null
          ev_spa?: number | null
          ev_spd?: number | null
          ev_spe?: number | null
          dynamax_level?: number | null
          is_alive?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          nuzlocke_id?: string
          player_id?: string
          nickname?: string
          species?: string
          gender?: string | null
          level?: number
          ability?: string | null
          nature?: string | null
          moves?: string[] | null
          iv_hp?: number | null
          iv_atk?: number | null
          iv_def?: number | null
          iv_spa?: number | null
          iv_spd?: number | null
          iv_spe?: number | null
          ev_hp?: number | null
          ev_atk?: number | null
          ev_def?: number | null
          ev_spa?: number | null
          ev_spd?: number | null
          ev_spe?: number | null
          dynamax_level?: number | null
          is_alive?: boolean
          created_at?: string
        }
      }
      battles: {
        Row: {
          id: string
          nuzlocke_id: string
          player1_id: string
          player2_id: string
          winner_id: string | null
          location: string | null
          notes: string | null
          battle_date: string
          created_at: string
        }
        Insert: {
          id?: string
          nuzlocke_id: string
          player1_id: string
          player2_id: string
          winner_id?: string | null
          location?: string | null
          notes?: string | null
          battle_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          nuzlocke_id?: string
          player1_id?: string
          player2_id?: string
          winner_id?: string | null
          location?: string | null
          notes?: string | null
          battle_date?: string
          created_at?: string
        }
      }
      casualties: {
        Row: {
          id: string
          battle_id: string
          pokemon_id: string
          created_at: string
        }
        Insert: {
          id?: string
          battle_id: string
          pokemon_id: string
          created_at?: string
        }
        Update: {
          id?: string
          battle_id?: string
          pokemon_id?: string
          created_at?: string
        }
      }
      nuzlocke_rules: {
        Row: {
          id: string
          nuzlocke_id: string
          rule_text: string
          rule_type: string
          created_at: string
        }
        Insert: {
          id?: string
          nuzlocke_id: string
          rule_text: string
          rule_type: string
          created_at?: string
        }
        Update: {
          id?: string
          nuzlocke_id?: string
          rule_text?: string
          rule_type?: string
          created_at?: string
        }
      }
    }
  }
}
