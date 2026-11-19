export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: "student" | "faculty" | "administrator" | "department_staff";
          registration_number: string | null;
          faculty_id: string | null;
          department_id: string | null;
          approval_status: "pending" | "approved" | "rejected";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: "student" | "faculty" | "administrator" | "department_staff";
          registration_number?: string | null;
          faculty_id?: string | null;
          department_id?: string | null;
          approval_status?: "pending" | "approved" | "rejected";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: "student" | "faculty" | "administrator" | "department_staff";
          registration_number?: string | null;
          faculty_id?: string | null;
          department_id?: string | null;
          approval_status?: "pending" | "approved" | "rejected";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      departments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          department_head: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          department_head?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          department_head?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      service_categories: {
        Row: {
          id: string;
          department_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          department_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          department_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          building_name: string;
          floor: string | null;
          room_number: string | null;
          qr_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          building_name: string;
          floor?: string | null;
          room_number?: string | null;
          qr_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          building_name?: string;
          floor?: string | null;
          room_number?: string | null;
          qr_code?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      service_requests: {
        Row: {
          id: string;
          request_number: string;
          user_id: string;
          department_id: string;
          category_id: string;
          location_id: string;
          title: string;
          description: string;
          severity: "Low" | "Medium" | "High" | "Critical";
          priority: "Low" | "Medium" | "High" | "Critical";
          status:
            | "Submitted"
            | "Under Review"
            | "Assigned"
            | "Accepted"
            | "In Progress"
            | "On Hold"
            | "Resolved"
            | "Closed"
            | "Rejected";
          image_url: string | null;
          assigned_staff_id: string | null;
          due_at: string | null;
          sla_deadline?: string | null;
          is_overdue?: boolean;
          suggested_priority?: string | null;
          priority_override_reason?: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          request_number?: string;
          user_id: string;
          department_id: string;
          category_id: string;
          location_id: string;
          title: string;
          description: string;
          severity: "Low" | "Medium" | "High" | "Critical";
          priority: "Low" | "Medium" | "High" | "Critical";
          status?:
            | "Submitted"
            | "Under Review"
            | "Assigned"
            | "Accepted"
            | "In Progress"
            | "On Hold"
            | "Resolved"
            | "Closed"
            | "Rejected";
          image_url?: string | null;
          assigned_staff_id?: string | null;
          due_at?: string | null;
          sla_deadline?: string | null;
          is_overdue?: boolean;
          suggested_priority?: string | null;
          priority_override_reason?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          request_number?: string;
          user_id?: string;
          department_id?: string;
          category_id?: string;
          location_id?: string;
          title?: string;
          description?: string;
          severity?: "Low" | "Medium" | "High" | "Critical";
          priority?: "Low" | "Medium" | "High" | "Critical";
          status?:
            | "Submitted"
            | "Under Review"
            | "Assigned"
            | "Accepted"
            | "In Progress"
            | "On Hold"
            | "Resolved"
            | "Closed"
            | "Rejected";
          image_url?: string | null;
          assigned_staff_id?: string | null;
          due_at?: string | null;
          sla_deadline?: string | null;
          is_overdue?: boolean;
          suggested_priority?: string | null;
          priority_override_reason?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      request_assignments: {
        Row: {
          id: string;
          request_id: string;
          staff_id: string;
          assigned_by: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          staff_id: string;
          assigned_by: string;
          assigned_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          staff_id?: string;
          assigned_by?: string;
          assigned_at?: string;
        };
        Relationships: [];
      };
      request_updates: {
        Row: {
          id: string;
          request_id: string;
          updated_by: string;
          old_status: string | null;
          new_status: string;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          updated_by: string;
          old_status?: string | null;
          new_status: string;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          updated_by?: string;
          old_status?: string | null;
          new_status?: string;
          comment?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          related_request_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          is_read?: boolean;
          related_request_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          related_request_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          content: string;
          created_by: string;
          target_audience: "all" | "student" | "faculty" | "department_staff";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          created_by: string;
          target_audience?: "all" | "student" | "faculty" | "department_staff";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          created_by?: string;
          target_audience?: "all" | "student" | "faculty" | "department_staff";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      feedback: {
        Row: {
          id: string;
          request_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
