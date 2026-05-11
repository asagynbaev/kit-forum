export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type LocalizedText = { ru: string; ky?: string; en?: string };

export interface Database {
  public: {
    Tables: {
      speakers: {
        Row: {
          id: string;
          name: Json;
          role: Json;
          topic: Json | null;
          country: Json;
          country_flag: string;
          photo: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: Json;
          role: Json;
          topic?: Json | null;
          country: Json;
          country_flag: string;
          photo?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: Json;
          role?: Json;
          topic?: Json | null;
          country?: Json;
          country_flag?: string;
          photo?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      program_sessions: {
        Row: {
          id: string;
          title: Json;
          description: Json | null;
          speakers_label: Json | null;
          session_type: "keynote" | "panel" | "workshop" | "break" | "networking" | "ceremony";
          track: string | null;
          starts_at: string | null;
          duration_min: number | null;
          room: Json | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: Json;
          description?: Json | null;
          speakers_label?: Json | null;
          session_type: "keynote" | "panel" | "workshop" | "break" | "networking" | "ceremony";
          track?: string | null;
          starts_at?: string | null;
          duration_min?: number | null;
          room?: Json | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: Json;
          description?: Json | null;
          speakers_label?: Json | null;
          session_type?: "keynote" | "panel" | "workshop" | "break" | "networking" | "ceremony";
          track?: string | null;
          starts_at?: string | null;
          duration_min?: number | null;
          room?: Json | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      session_speakers: {
        Row: { session_id: string; speaker_id: string };
        Insert: { session_id: string; speaker_id: string };
        Update: { session_id?: string; speaker_id?: string };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          label: string;
          url: string;
          icon: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          label: string;
          url: string;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          label?: string;
          url?: string;
          icon?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
