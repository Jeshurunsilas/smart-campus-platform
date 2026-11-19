export type UserRole = "student" | "faculty" | "administrator" | "staff";

export type AccountApprovalStatus = "pending" | "approved" | "rejected";

export type RequestStatus =
  | "Submitted"
  | "Under Review"
  | "Assigned"
  | "Accepted"
  | "In Progress"
  | "On Hold"
  | "Resolved"
  | "Closed"
  | "Rejected";

export type RequestPriority = "Low" | "Medium" | "High" | "Critical";

export type RequestSeverity = "Low" | "Medium" | "High" | "Critical";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  approval_status: AccountApprovalStatus;
  avatar_url?: string | null;
  phone_number?: string | null;
  department_id?: string | null;
  student_id?: string | null;
  faculty_id?: string | null;
  staff_id?: string | null;
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  head_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  department_id: string;
  name: string;
  description?: string | null;
  default_priority: RequestPriority;
  estimated_sla_hours: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  department?: Department;
}

export interface CampusLocation {
  id: string;
  building: string;
  floor?: string | null;
  room_number?: string | null;
  zone?: string | null;
  qr_code_token?: string | null;
  description?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  tracking_number: string;
  title: string;
  description: string;
  user_id: string;
  department_id: string;
  category_id: string;
  location_id: string;
  severity: RequestSeverity;
  priority: RequestPriority;
  suggested_priority?: RequestPriority;
  priority_overridden_by?: string | null;
  priority_override_reason?: string | null;
  status: RequestStatus;
  attachments?: string[];
  completion_photos?: string[];
  sla_deadline?: string | null;
  is_overdue: boolean;
  escalated_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  creator?: UserProfile;
  department?: Department;
  category?: ServiceCategory;
  location?: CampusLocation;
  assignments?: RequestAssignment[];
  updates?: RequestUpdate[];
  feedback?: ServiceFeedback;
}

export interface RequestAssignment {
  id: string;
  request_id: string;
  staff_id: string;
  assigned_by: string;
  status: "assigned" | "accepted" | "in_progress" | "completed" | "reassigned";
  notes?: string | null;
  assigned_at: string;
  accepted_at?: string | null;
  completed_at?: string | null;
  staff?: UserProfile;
  assigner?: UserProfile;
}

export interface RequestUpdate {
  id: string;
  request_id: string;
  user_id: string;
  previous_status?: RequestStatus | null;
  new_status: RequestStatus;
  note: string;
  attachment_url?: string | null;
  is_internal_only: boolean;
  created_at: string;
  user?: UserProfile;
}

export interface InAppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "status_change" | "assignment" | "approval" | "announcement" | "escalation" | "feedback";
  read: boolean;
  request_id?: string | null;
  link_url?: string | null;
  created_at: string;
}

export interface CampusAnnouncement {
  id: string;
  title: string;
  content: string;
  category: "General" | "Maintenance" | "Emergency" | "Event";
  priority: "low" | "medium" | "high";
  target_roles?: UserRole[];
  published_by: string;
  is_published: boolean;
  expires_at?: string | null;
  created_at: string;
  publisher?: UserProfile;
}

export interface ServiceFeedback {
  id: string;
  request_id: string;
  user_id: string;
  rating: number; // 1 to 5
  comment?: string | null;
  service_quality_rating?: number;
  timeliness_rating?: number;
  staff_courtesy_rating?: number;
  created_at: string;
  user?: UserProfile;
}

export interface SmartDuplicateCheckResult {
  hasPotentialDuplicates: boolean;
  duplicates: Array<{
    id: string;
    tracking_number: string;
    title: string;
    status: RequestStatus;
    created_at: string;
  }>;
}

export interface DepartmentScorecard {
  department_id: string;
  department_name: string;
  total_requests: number;
  open_requests: number;
  in_progress_requests: number;
  resolved_requests: number;
  overdue_requests: number;
  avg_resolution_hours: number;
  completion_rate_percentage: number;
  avg_satisfaction_rating: number;
}
