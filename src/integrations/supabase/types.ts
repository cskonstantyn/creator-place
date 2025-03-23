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
      applicants: {
        Row: {
          creator_avatar: string | null
          creator_email: string | null
          creator_followers: number | null
          creator_id: string
          creator_name: string | null
          creator_platform: string | null
          form_id: string
          id: string
          status: string
          submission_date: string
        }
        Insert: {
          creator_avatar?: string | null
          creator_email?: string | null
          creator_followers?: number | null
          creator_id: string
          creator_name?: string | null
          creator_platform?: string | null
          form_id: string
          id?: string
          status: string
          submission_date?: string
        }
        Update: {
          creator_avatar?: string | null
          creator_email?: string | null
          creator_followers?: number | null
          creator_id?: string
          creator_name?: string | null
          creator_platform?: string | null
          form_id?: string
          id?: string
          status?: string
          submission_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "applicants_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_deals: {
        Row: {
          accounts_to_mention: string[]
          address: string | null
          benefits: string
          brand_name: string
          category: string
          collaboration_type: string
          content_type: string
          created_at: string
          creators_needed: number
          deadline_to_apply: string
          deadline_to_post: string
          deal_value: string
          description: string
          dos_and_donts: string[]
          expires: string
          followers_required: number
          guests_allowed: number
          hashtags: string[]
          id: string
          image_url: string
          industry: string
          is_featured: boolean
          location: string
          platform: string
          price: number
          promotion_type: string
          reference_images: string[]
          reference_videos: Json
          special_instructions: string | null
          status: string
          title: string
          views: number
        }
        Insert: {
          accounts_to_mention?: string[]
          address?: string | null
          benefits: string
          brand_name: string
          category: string
          collaboration_type: string
          content_type?: string
          created_at?: string
          creators_needed?: number
          deadline_to_apply: string
          deadline_to_post: string
          deal_value: string
          description: string
          dos_and_donts?: string[]
          expires: string
          followers_required?: number
          guests_allowed?: number
          hashtags?: string[]
          id?: string
          image_url: string
          industry: string
          is_featured?: boolean
          location: string
          platform: string
          price?: number
          promotion_type: string
          reference_images?: string[]
          reference_videos?: Json
          special_instructions?: string | null
          status?: string
          title: string
          views?: number
        }
        Update: {
          accounts_to_mention?: string[]
          address?: string | null
          benefits?: string
          brand_name?: string
          category?: string
          collaboration_type?: string
          content_type?: string
          created_at?: string
          creators_needed?: number
          deadline_to_apply?: string
          deadline_to_post?: string
          deal_value?: string
          description?: string
          dos_and_donts?: string[]
          expires?: string
          followers_required?: number
          guests_allowed?: number
          hashtags?: string[]
          id?: string
          image_url?: string
          industry?: string
          is_featured?: boolean
          location?: string
          platform?: string
          price?: number
          promotion_type?: string
          reference_images?: string[]
          reference_videos?: Json
          special_instructions?: string | null
          status?: string
          title?: string
          views?: number
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          agency_id: string
          attached_forms: string[]
          campaign_name: string
          created_at: string
          id: string
          marketing_goals: Json
          updated_at: string
        }
        Insert: {
          agency_id: string
          attached_forms: string[]
          campaign_name: string
          created_at?: string
          id?: string
          marketing_goals: Json
          updated_at?: string
        }
        Update: {
          agency_id?: string
          attached_forms?: string[]
          campaign_name?: string
          created_at?: string
          id?: string
          marketing_goals?: Json
          updated_at?: string
        }
        Relationships: []
      }
      communications: {
        Row: {
          created_at: string | null
          event_id: string | null
          message_content: string | null
          message_id: string
          recipient_role_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          message_content?: string | null
          message_id?: string
          recipient_role_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          message_content?: string | null
          message_id?: string
          recipient_role_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "communications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "communications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "communications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "communications_recipient_role_id_fkey"
            columns: ["recipient_role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      discount_deals: {
        Row: {
          campaign_period_end: string | null
          campaign_period_start: string | null
          coupon_code: string | null
          created_at: string
          description: string
          discount_percentage: number | null
          discounted_price: number
          id: string
          image_url: string
          items_sold: number | null
          location: string | null
          original_price: number
          package_details: string | null
          redeem_policy: Json | null
          special_instructions: string[] | null
          status: string | null
          store_address: string | null
          store_name: string
          tags: string[] | null
          title: string
          updated_at: string
          usage_limit: number | null
          views: number | null
        }
        Insert: {
          campaign_period_end?: string | null
          campaign_period_start?: string | null
          coupon_code?: string | null
          created_at?: string
          description: string
          discount_percentage?: number | null
          discounted_price: number
          id?: string
          image_url: string
          items_sold?: number | null
          location?: string | null
          original_price: number
          package_details?: string | null
          redeem_policy?: Json | null
          special_instructions?: string[] | null
          status?: string | null
          store_address?: string | null
          store_name: string
          tags?: string[] | null
          title: string
          updated_at?: string
          usage_limit?: number | null
          views?: number | null
        }
        Update: {
          campaign_period_end?: string | null
          campaign_period_start?: string | null
          coupon_code?: string | null
          created_at?: string
          description?: string
          discount_percentage?: number | null
          discounted_price?: number
          id?: string
          image_url?: string
          items_sold?: number | null
          location?: string | null
          original_price?: number
          package_details?: string | null
          redeem_policy?: Json | null
          special_instructions?: string[] | null
          status?: string | null
          store_address?: string | null
          store_name?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          usage_limit?: number | null
          views?: number | null
        }
        Relationships: []
      }
      discount_listings: {
        Row: {
          brand_name: string
          category: string
          created_at: string
          description: string
          discount_code: string | null
          discount_percentage: number | null
          discounted_price: number | null
          expiration_date: string | null
          id: string
          location: string | null
          original_price: number
          reference_images: string[] | null
          reference_videos: string[] | null
          status: string | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          brand_name: string
          category: string
          created_at?: string
          description: string
          discount_code?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          expiration_date?: string | null
          id?: string
          location?: string | null
          original_price: number
          reference_images?: string[] | null
          reference_videos?: string[] | null
          status?: string | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          brand_name?: string
          category?: string
          created_at?: string
          description?: string
          discount_code?: string | null
          discount_percentage?: number | null
          discounted_price?: number | null
          expiration_date?: string | null
          id?: string
          location?: string | null
          original_price?: number
          reference_images?: string[] | null
          reference_videos?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      event_logs: {
        Row: {
          event_id: string
          log_id: string
          log_time: string | null
          new_status: string | null
          previous_status: string | null
        }
        Insert: {
          event_id: string
          log_id?: string
          log_time?: string | null
          new_status?: string | null
          previous_status?: string | null
        }
        Update: {
          event_id?: string
          log_id?: string
          log_time?: string | null
          new_status?: string | null
          previous_status?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          agenda_generated: boolean | null
          created_at: string | null
          description: string | null
          end_date: string | null
          event_id: string
          location: string | null
          organizer_id: string | null
          start_date: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          agenda_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_id?: string
          location?: string | null
          organizer_id?: string | null
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          agenda_generated?: boolean | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          event_id?: string
          location?: string | null
          organizer_id?: string | null
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      forms: {
        Row: {
          brief_details: Json
          collaboration_type: string
          compensation: Json | null
          content_type: string[]
          created_at: string
          deadline_to_apply: string
          deadline_to_post: string
          guest_info: Json | null
          id: string
          industry: string
          min_followers: number
          num_creators: number
          offline_type: string | null
          platform: string[]
          promotion_type: string
          reference_media: string | null
          status: string
          store_address: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brief_details: Json
          collaboration_type: string
          compensation?: Json | null
          content_type: string[]
          created_at?: string
          deadline_to_apply: string
          deadline_to_post: string
          guest_info?: Json | null
          id?: string
          industry: string
          min_followers: number
          num_creators: number
          offline_type?: string | null
          platform: string[]
          promotion_type: string
          reference_media?: string | null
          status: string
          store_address?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brief_details?: Json
          collaboration_type?: string
          compensation?: Json | null
          content_type?: string[]
          created_at?: string
          deadline_to_apply?: string
          deadline_to_post?: string
          guest_info?: Json | null
          id?: string
          industry?: string
          min_followers?: number
          num_creators?: number
          offline_type?: string | null
          platform?: string[]
          promotion_type?: string
          reference_media?: string | null
          status?: string
          store_address?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          description: string
          features: string[]
          id: number
          name: string
          price: number
        }
        Insert: {
          description: string
          features: string[]
          id?: number
          name: string
          price: number
        }
        Update: {
          description?: string
          features?: string[]
          id?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          permission_id: string
          resource: string
          role_id: string | null
        }
        Insert: {
          action: string
          permission_id?: string
          resource: string
          role_id?: string | null
        }
        Update: {
          action?: string
          permission_id?: string
          resource?: string
          role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
      post_submissions: {
        Row: {
          applicant_id: string
          engagement: number | null
          id: string
          platform: string | null
          post_link: string
          status: string
          submission_date: string
          views: number | null
        }
        Insert: {
          applicant_id: string
          engagement?: number | null
          id?: string
          platform?: string | null
          post_link: string
          status: string
          submission_date?: string
          views?: number | null
        }
        Update: {
          applicant_id?: string
          engagement?: number | null
          id?: string
          platform?: string | null
          post_link?: string
          status?: string
          submission_date?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_submissions_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "applicants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          role_id: string
          role_name: string
        }
        Insert: {
          role_id?: string
          role_name: string
        }
        Update: {
          role_id?: string
          role_name?: string
        }
        Relationships: []
      }
      sponsor_applications: {
        Row: {
          application_id: string
          application_status: string | null
          applied_on: string | null
          event_id: string | null
          review_comments: string | null
          sponsor_id: string | null
        }
        Insert: {
          application_id?: string
          application_status?: string | null
          applied_on?: string | null
          event_id?: string | null
          review_comments?: string | null
          sponsor_id?: string | null
        }
        Update: {
          application_id?: string
          application_status?: string | null
          applied_on?: string | null
          event_id?: string | null
          review_comments?: string | null
          sponsor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["sponsor_id"]
          },
        ]
      }
      sponsors: {
        Row: {
          contact_info: string | null
          created_at: string | null
          event_id: string | null
          name: string
          sponsor_id: string
          sponsorship_level: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          event_id?: string | null
          name: string
          sponsor_id?: string
          sponsorship_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          event_id?: string | null
          name?: string
          sponsor_id?: string
          sponsorship_level?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string | null
          event_id: string | null
          price: number | null
          quantity_available: number | null
          ticket_id: string
          ticket_type: string
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          price?: number | null
          quantity_available?: number | null
          ticket_id?: string
          ticket_type: string
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          price?: number | null
          quantity_available?: number | null
          ticket_id?: string
          ticket_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          role_id: string
          user_id: string
        }
        Insert: {
          role_id: string
          user_id: string
        }
        Update: {
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          end_date: string | null
          package_id: string
          start_date: string | null
          status: string | null
          subscription_id: string
          user_id: string | null
        }
        Insert: {
          end_date?: string | null
          package_id: string
          start_date?: string | null
          status?: string | null
          subscription_id?: string
          user_id?: string | null
        }
        Update: {
          end_date?: string | null
          package_id?: string
          start_date?: string | null
          status?: string | null
          subscription_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_usage: {
        Row: {
          limit_amount: number | null
          subscription_id: string | null
          usage_amount: number | null
          usage_date: string
          usage_id: string
          user_id: string | null
        }
        Insert: {
          limit_amount?: number | null
          subscription_id?: string | null
          usage_amount?: number | null
          usage_date: string
          usage_id?: string
          user_id?: string | null
        }
        Update: {
          limit_amount?: number | null
          subscription_id?: string | null
          usage_amount?: number | null
          usage_date?: string
          usage_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_usage_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_subscriptions"
            referencedColumns: ["subscription_id"]
          },
          {
            foreignKeyName: "user_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          password_hash: string
          profile_info: string | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          password_hash: string
          profile_info?: string | null
          updated_at?: string | null
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          password_hash?: string
          profile_info?: string | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      vendor_applications: {
        Row: {
          application_id: string
          application_status: string | null
          applied_on: string | null
          event_id: string | null
          review_comments: string | null
          vendor_id: string | null
        }
        Insert: {
          application_id?: string
          application_status?: string | null
          applied_on?: string | null
          event_id?: string | null
          review_comments?: string | null
          vendor_id?: string | null
        }
        Update: {
          application_id?: string
          application_status?: string | null
          applied_on?: string | null
          event_id?: string | null
          review_comments?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["vendor_id"]
          },
        ]
      }
      vendors: {
        Row: {
          category: string | null
          contact_info: string | null
          created_at: string | null
          event_id: string | null
          name: string
          status: string | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          category?: string | null
          contact_info?: string | null
          created_at?: string | null
          event_id?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Update: {
          category?: string | null
          contact_info?: string | null
          created_at?: string | null
          event_id?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendors_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          features: string[];
          type: string;
          duration_days: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          price: number;
          features?: string[];
          type: string;
          duration_days: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          features?: string[];
          type?: string;
          duration_days?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      payment_intents: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          amount: number;
          currency: string;
          status: string;
          created_at: string;
          updated_at: string;
          metadata?: Record<string, any>;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          amount: number;
          currency: string;
          status: string;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, any>;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          metadata?: Record<string, any>;
        };
        Relationships: [];
      };
    }
    Views: {
      organizer_view: {
        Row: {
          agenda_generated: boolean | null
          created_at: string | null
          description: string | null
          email: string | null
          end_date: string | null
          event_id: string | null
          location: string | null
          organizer_id: string | null
          start_date: string | null
          title: string | null
          updated_at: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      sponsor_view: {
        Row: {
          agenda_generated: boolean | null
          contact_info: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          event_id: string | null
          location: string | null
          organizer_id: string | null
          sponsor_name: string | null
          sponsorship_level: string | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      vendor_view: {
        Row: {
          agenda_generated: boolean | null
          category: string | null
          contact_info: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          event_id: string | null
          location: string | null
          organizer_id: string | null
          start_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          vendor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      view_sponsor_applications: {
        Row: {
          application_id: string | null
          application_status: string | null
          applied_on: string | null
          event_id: string | null
          event_title: string | null
          review_comments: string | null
          sponsor_id: string | null
          sponsor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "sponsor_applications_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["sponsor_id"]
          },
        ]
      }
      view_vendor_applications: {
        Row: {
          application_id: string | null
          application_status: string | null
          applied_on: string | null
          event_id: string | null
          event_title: string | null
          review_comments: string | null
          vendor_id: string | null
          vendor_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "organizer_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "sponsor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "vendor_view"
            referencedColumns: ["event_id"]
          },
          {
            foreignKeyName: "vendor_applications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["vendor_id"]
          },
        ]
      }
    }
    Functions: {
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Returns: boolean
      }
      create_event: {
        Args: {
          organizer_id: string
          title: string
          description: string
          start_date: string
          end_date: string
          location: string
        }
        Returns: string
      }
      generate_communications: {
        Args: {
          event_id: string
          recipient_role: string
          message_template: string
        }
        Returns: {
          created_at: string | null
          event_id: string | null
          message_content: string | null
          message_id: string
          recipient_role_id: string | null
          status: string | null
        }[]
      }
      generate_tickets: {
        Args: {
          event_id: string
          ticket_type: string
          price: number
          quantity: number
        }
        Returns: string
      }
      increment_brand_deal_views: {
        Args: {
          deal_id: string
        }
        Returns: undefined
      }
      increment_discount_deal_views: {
        Args: {
          deal_id: string
        }
        Returns: undefined
      }
      increment_discount_listing_views: {
        Args: {
          listing_id: string
        }
        Returns: undefined
      }
      manage_function: {
        Args: {
          operation: string
          function_name: string
          return_type?: string
          function_body?: string
          arg_types?: string
        }
        Returns: string
      }
      manage_table: {
        Args: {
          operation: string
          table_name: string
          columns?: string
          column_name?: string
          new_column_name?: string
          column_type?: string
        }
        Returns: string
      }
      process_sponsorship: {
        Args: {
          sponsor_id: string
          event_id: string
          decision: boolean
        }
        Returns: string
      }
      submit_vendor_application: {
        Args: {
          vendor_id: string
          event_id: string
        }
        Returns: string
      }
      update_application_status: {
        Args: {
          application_id: string
          new_status: string
          comments: string
          is_vendor: boolean
        }
        Returns: string
      }
      update_subscription_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_subscription: {
        Args: {
          user_id: string
          new_package_id: string
        }
        Returns: string
      }
    }
    Enums: {
      app_permission:
        | "channels.delete"
        | "messages.delete"
        | "read"
        | "write"
        | "update"
        | "delete"
      app_role: "admin" | "moderator" | "creator" | "brand" | "organizer"
      user_status: "ONLINE" | "OFFLINE"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
