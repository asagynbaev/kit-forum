export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type LocalizedText = { ru: string; ky?: string; en?: string };

export type AppLocale = "ru" | "ky" | "en";

export type ForumRegistrationStatus =
  | "new"
  | "contacted"
  | "confirmed"
  | "rejected"
  | "archived";

export type ForumRegistrationSource =
  | "contacts"
  | "kit_award"
  | "hero"
  | "footer"
  | "other";

export type AwardApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "rejected"
  | "winner";

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
      contact_persons: {
        Row: {
          id: string;
          label: Json;
          name: Json;
          phone: string;
          phone_href: string;
          emails: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: Json;
          name: Json;
          phone?: string;
          phone_href?: string;
          emails?: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: Json;
          name?: Json;
          phone?: string;
          phone_href?: string;
          emails?: string;
          order_index?: number;
          created_at?: string;
        };
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
      forum_registrations: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          organization: string | null;
          role: string | null;
          message: string | null;
          language: AppLocale;
          status: ForumRegistrationStatus;
          source: ForumRegistrationSource;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone?: string | null;
          organization?: string | null;
          role?: string | null;
          message?: string | null;
          language?: AppLocale;
          status?: ForumRegistrationStatus;
          source?: ForumRegistrationSource;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          organization?: string | null;
          role?: string | null;
          message?: string | null;
          language?: AppLocale;
          status?: ForumRegistrationStatus;
          source?: ForumRegistrationSource;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      award_applications: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string;
          nomination: string;
          organization: string | null;
          project_name: string | null;
          project_description: string | null;
          questionnaire: Json | null;
          website: string | null;
          socials: string | null;
          language: AppLocale;
          status: AwardApplicationStatus;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          phone: string;
          nomination: string;
          organization?: string | null;
          project_name?: string | null;
          project_description?: string | null;
          questionnaire?: Json | null;
          website?: string | null;
          socials?: string | null;
          language?: AppLocale;
          status?: AwardApplicationStatus;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          nomination?: string;
          organization?: string | null;
          project_name?: string | null;
          project_description?: string | null;
          questionnaire?: Json | null;
          website?: string | null;
          socials?: string | null;
          language?: AppLocale;
          status?: AwardApplicationStatus;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      contact_blocks: {
        Row: { id: string; label: Json; title: Json; lines: Json; order_index: number };
        Insert: { id?: string; label: Json; title: Json; lines: Json; order_index?: number };
        Update: { id?: string; label?: Json; title?: Json; lines?: Json; order_index?: number };
        Relationships: [];
      };
      partners: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          order_index: number;
          is_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url: string;
          order_index?: number;
          is_visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string;
          order_index?: number;
          is_visible?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      press_releases: {
        Row: {
          id: string;
          date_label: string;
          tag: string;
          title: Json;
          lead: Json;
          body: Json | null;
          order_index: number;
          is_visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          date_label: string;
          tag?: string;
          title: Json;
          lead: Json;
          body?: Json | null;
          order_index?: number;
          is_visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          date_label?: string;
          tag?: string;
          title?: Json;
          lead?: Json;
          body?: Json | null;
          order_index?: number;
          is_visible?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_email_registered: {
        Args: { p_email: string };
        Returns: boolean;
      };
    };
  };
}
