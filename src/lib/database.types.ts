export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type LocalizedText = { ru: string; ky?: string; en?: string };

export interface Database {
  public: {
    Tables: {
      speakers: {
        Row: {
          id: string;
          name: LocalizedText;
          role: LocalizedText;
          topic: LocalizedText | null;
          country: LocalizedText;
          country_flag: string;
          photo: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["speakers"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["speakers"]["Insert"]>;
      };
      program_sessions: {
        Row: {
          id: string;
          title: LocalizedText;
          description: LocalizedText | null;
          speakers_label: LocalizedText | null;
          session_type: "keynote" | "panel" | "workshop" | "break" | "networking" | "ceremony";
          track: string | null;
          starts_at: string | null;
          duration_min: number | null;
          room: LocalizedText | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["program_sessions"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["program_sessions"]["Insert"]>;
      };
      session_speakers: {
        Row: {
          session_id: string;
          speaker_id: string;
        };
        Insert: Database["public"]["Tables"]["session_speakers"]["Row"];
        Update: Partial<Database["public"]["Tables"]["session_speakers"]["Row"]>;
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
        Insert: Omit<Database["public"]["Tables"]["social_links"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["social_links"]["Insert"]>;
      };
    };
  };
}
