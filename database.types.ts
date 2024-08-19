export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      movie_theaters: {
        Row: {
          id: number
          movie_id: number
          theaters_id: number
        }
        Insert: {
          id?: number
          movie_id: number
          theaters_id: number
        }
        Update: {
          id?: number
          movie_id?: number
          theaters_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "movie_theaters_movie_id_fkey"
            columns: ["movie_id"]
            isOneToOne: false
            referencedRelation: "upcoming_movie"
            referencedColumns: ["pk"]
          },
          {
            foreignKeyName: "movie_theaters_theaters_id_fkey"
            columns: ["theaters_id"]
            isOneToOne: false
            referencedRelation: "theaters"
            referencedColumns: ["id"]
          },
        ]
      }
      netflix_horror_en: {
        Row: {
          pk: number
          release_date: string
          the_movie_db_id: number
          title: string
        }
        Insert: {
          pk?: number
          release_date: string
          the_movie_db_id: number
          title: string
        }
        Update: {
          pk?: number
          release_date?: string
          the_movie_db_id?: number
          title?: string
        }
        Relationships: []
      }
      netflix_horror_expiring: {
        Row: {
          expired_date: string
          id: number
          the_movie_db_id: number
          title: string
        }
        Insert: {
          expired_date: string
          id?: number
          the_movie_db_id: number
          title: string
        }
        Update: {
          expired_date?: string
          id?: number
          the_movie_db_id?: number
          title?: string
        }
        Relationships: []
      }
      netflix_horror_kr: {
        Row: {
          id: number
          overview: string | null
          pk: number
          poster_path: string
          the_movie_db_id: number
          title: string
        }
        Insert: {
          id?: number
          overview?: string | null
          pk?: number
          poster_path: string
          the_movie_db_id: number
          title: string
        }
        Update: {
          id?: number
          overview?: string | null
          pk?: number
          poster_path?: string
          the_movie_db_id?: number
          title?: string
        }
        Relationships: []
      }
      theaters: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      token: {
        Row: {
          id: number
          time: string
          token: string
        }
        Insert: {
          id?: number
          time: string
          token: string
        }
        Update: {
          id?: number
          time?: string
          token?: string
        }
        Relationships: []
      }
      topic: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      topic_to_token: {
        Row: {
          id: number
          token_id: number | null
          topic_id: number | null
        }
        Insert: {
          id?: number
          token_id?: number | null
          topic_id?: number | null
        }
        Update: {
          id?: number
          token_id?: number | null
          topic_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fkcl4668fmyhilmd966bihk4nn"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fkfh7rnl6olo3oeg0lx7l6i91k3"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "token"
            referencedColumns: ["id"]
          },
        ]
      }
      upcoming_movie: {
        Row: {
          id: number
          overview: string | null
          pk: number
          poster_path: string
          release_date: string
          title: string
        }
        Insert: {
          id?: number
          overview?: string | null
          pk?: number
          poster_path: string
          release_date: string
          title: string
        }
        Update: {
          id?: number
          overview?: string | null
          pk?: number
          poster_path?: string
          release_date?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
  | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
    Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
    PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
    PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
  | keyof PublicSchema["Tables"]
  | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
  | keyof PublicSchema["Enums"]
  | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
  ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never
