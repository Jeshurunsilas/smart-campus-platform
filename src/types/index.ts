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
  updated_at?: string;
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
  image_url?: string | null;
  due_at?: string | null;
  assigned_staff_id?: string | null;
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

// ==============================================================================
// SMART CAMPUS OPERATIONS & IoT TYPES
// ==============================================================================

export interface CampusBuilding {
  id: string;
  name: string;
  code: string;
  coordinates_x: number;
  coordinates_y: number;
  floors_count: number;
  total_area_sqft: number;
  baseline_energy_kwh: number;
  baseline_water_liters: number;
  description?: string | null;
  is_active: boolean;
  floors?: CampusFloor[];
  rooms?: CampusRoom[];
}

export interface CampusFloor {
  id: string;
  building_id: string;
  floor_number: number;
  floor_name: string;
  floor_plan_svg?: string | null;
  rooms?: CampusRoom[];
}

export interface CampusRoom {
  id: string;
  building_id: string;
  floor_id?: string | null;
  room_number: string;
  room_name: string;
  room_type: "classroom" | "lecture_hall" | "lab" | "office" | "seminar" | "auditorium" | "library";
  capacity: number;
  current_occupancy: number;
  qr_code?: string | null;
  is_active: boolean;
  building?: CampusBuilding;
  floor?: CampusFloor;
  assets?: CampusAsset[];
}

export type AssetCategory =
  | "hvac"
  | "electrical"
  | "av_projector"
  | "lab_instrument"
  | "plumbing"
  | "it_hardware"
  | "safety";

export type AssetStatus =
  | "operational"
  | "degraded"
  | "in_maintenance"
  | "fault"
  | "decommissioned";

export interface CampusAsset {
  id: string;
  asset_tag: string;
  name: string;
  category: AssetCategory;
  manufacturer?: string | null;
  model_number?: string | null;
  serial_number?: string | null;
  building_id?: string | null;
  floor_id?: string | null;
  room_id?: string | null;
  department_id?: string | null;
  installation_date?: string | null;
  warranty_expiry?: string | null;
  operational_status: AssetStatus;
  health_score: number;
  maintenance_interval_days: number;
  last_inspection_date?: string | null;
  next_inspection_date?: string | null;
  qr_code?: string | null;
  notes?: string | null;
  building?: CampusBuilding;
  room?: CampusRoom;
  department?: Department;
  maintenance_logs?: AssetMaintenanceLog[];
}

export interface AssetMaintenanceLog {
  id: string;
  asset_id: string;
  service_request_id?: string | null;
  log_type: "inspection" | "preventive" | "corrective" | "calibration";
  notes: string;
  performed_by?: string | null;
  downtime_hours: number;
  cost: number;
  created_at: string;
  performer?: UserProfile;
}

export type SensorType =
  | "temperature"
  | "humidity"
  | "occupancy"
  | "electricity_meter"
  | "water_meter"
  | "vibration"
  | "air_quality";

export interface SensorDevice {
  id: string;
  device_eui: string;
  name: string;
  sensor_type: SensorType;
  building_id: string;
  floor_id?: string | null;
  room_id?: string | null;
  asset_id?: string | null;
  unit: string;
  sampling_rate_sec: number;
  is_active: boolean;
  is_simulated: boolean;
  latest_reading?: SensorReading | null;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  timestamp: string;
  metric_type: string;
  value: number;
  unit: string;
  is_anomaly: boolean;
  is_simulated: boolean;
}

export interface CampusIncident {
  id: string;
  incident_number: string;
  title: string;
  description: string;
  category: "safety" | "facility_fault" | "network_outage" | "power_failure" | "water_leakage" | "fire_drill" | "medical";
  severity: "low" | "medium" | "high" | "critical";
  status: "reported" | "acknowledged" | "assigned" | "investigating" | "mitigated" | "resolved" | "closed";
  building_id?: string | null;
  room_id?: string | null;
  assigned_department_id?: string | null;
  reported_by?: string | null;
  acknowledged_at?: string | null;
  resolved_at?: string | null;
  evacuation_route_json?: {
    primary_exit: string;
    alternative_exit: string;
    assembly_point: string;
    blocked_exits?: string[];
  } | null;
  building?: CampusBuilding;
  room?: CampusRoom;
  department?: Department;
  reporter?: UserProfile;
  created_at: string;
}

export interface MaintenancePrediction {
  id: string;
  asset_id: string;
  risk_score: number; // 0 to 100
  risk_level: "low" | "medium" | "high" | "critical";
  failure_mode: string;
  confidence_pct: number;
  contributing_factors: Array<{ factor: string; weight_pct: number; description: string }>;
  recommended_action: string;
  recommended_date: string;
  status: "active" | "converted_to_request" | "dismissed";
  converted_request_id?: string | null;
  asset?: CampusAsset;
}

export interface ResourceRecommendation {
  id: string;
  title: string;
  resource_type: "room_reallocation" | "energy_shedding" | "hvac_optimization";
  context_data: Record<string, unknown>;
  score: number;
  impact_description: string;
  is_applied: boolean;
  applied_at?: string | null;
  created_at: string;
}

// ==============================================================================
// ACADEMIC MANAGEMENT & UNIVERSITY EVALUATION TYPES
// ==============================================================================

export interface AcademicYear {
  id: string;
  year_label: string; // e.g. "2025-2026"
  start_date: string;
  end_date: string;
  is_current: boolean;
}

export interface AcademicSemester {
  id: string;
  academic_year_id: string;
  semester_code: string; // e.g. "Fall 2025", "Spring 2026"
  semester_type?: "odd" | "even" | "summer";
  term?: string;
  start_date: string;
  end_date: string;
  is_current?: boolean;
  is_active?: boolean;
  registration_open?: boolean;
  academic_year?: AcademicYear;
}

export interface AcademicProgramme {
  id: string;
  department_id?: string;
  name: string;
  code?: string; // e.g. "BTECH-CSE"
  programme_code?: string;
  degree_type?: "Undergraduate" | "Postgraduate" | "Doctoral";
  degree_level?: string;
  duration_years: number;
  total_credits: number;
  department?: Department;
}

export type CourseApprovalStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "MODIFICATIONS_REQUESTED";

export type CoursePublicationStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "UNPUBLISHED"
  | "ARCHIVED";

export type CourseCategory =
  | "Core"
  | "Elective"
  | "Lab"
  | "Open Elective"
  | "Capstone";

export type CourseRequestType = "student_join" | "faculty_collaboration";

export type CourseRequestedRole =
  | "student"
  | "co_instructor"
  | "teaching_assistant"
  | "contributor";

export type CourseRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "WAITLISTED"
  | "CANCELLED";

export type CourseMembershipRole =
  | "owner"
  | "course_owner"
  | "co_instructor"
  | "teaching_assistant"
  | "contributor"
  | "student";

export type CourseMembershipStatus =
  | "active"
  | "suspended"
  | "dropped"
  | "ACTIVE"
  | "SUSPENDED"
  | "DROPPED";

export interface AcademicCourse {
  id: string;
  programme_id?: string | null;
  department_id: string;
  academic_year_id?: string | null;
  academic_year?: string;
  semester_id?: string | null;
  semester?: string;
  faculty_owner_id?: string | null;
  course_code: string; // e.g. "CS301"
  title: string;
  description: string;
  credits: number;
  course_category?: CourseCategory;
  lecture_hours: number;
  lab_hours: number;
  tutorial_hours?: number;
  prerequisites: string[];
  max_enrolment_capacity: number;
  start_date?: string | null;
  end_date?: string | null;
  course_start_date?: string;
  course_end_date?: string;
  schedule_summary?: string | null;
  class_schedule?: string | null;
  classroom_location?: string | null;
  learning_objectives?: string[];
  syllabus_url?: string | null;
  course_image_url?: string | null;
  allow_enrolment?: boolean;
  allow_faculty_collaboration?: boolean;
  enrolment_deadline?: string | null;
  approval_status?: CourseApprovalStatus;
  publication_status?: CoursePublicationStatus;
  rejection_reason?: string | null;
  modification_notes?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  is_published: boolean;
  department?: Department;
  programme?: AcademicProgramme;
  faculty_owner?: UserProfile;
  sections?: CourseSection[];
  memberships?: CourseMembership[];
  materials?: CourseLearningMaterial[];
}

export interface CourseEnrolmentRequest {
  id: string;
  course_id: string;
  section_id?: string | null;
  applicant_id: string;
  applicant_role: "student" | "faculty";
  request_type: CourseRequestType;
  requested_role: CourseRequestedRole;
  reason?: string | null;
  status: CourseRequestStatus;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  course?: AcademicCourse;
  applicant?: UserProfile;
  reviewer?: UserProfile;
}

export interface CourseMembership {
  id: string;
  course_id: string;
  user_id: string;
  membership_role?: CourseMembershipRole;
  role?: CourseMembershipRole;
  status: CourseMembershipStatus;
  approved_by?: string | null;
  approved_at?: string | null;
  created_at: string;
  updated_at?: string;
  course?: AcademicCourse;
  user?: UserProfile;
}

export interface CourseLearningMaterial {
  id: string;
  course_id: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_type?: "pdf" | "slides" | "code" | "video" | "notes";
  material_type?: "syllabus" | "slides" | "code" | "notes" | "assignment" | "video";
  file_size_mb?: number;
  file_size_bytes?: number;
  is_public?: boolean;
  display_order?: number;
  uploaded_by: string;
  created_at: string;
  uploader?: UserProfile;
}

export interface CourseScheduleSlot {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
  start_time: string;
  end_time: string;
}

export interface CourseSection {
  id: string;
  course_id: string;
  semester_id?: string;
  section_name?: string;
  section_code?: string;
  room?: string | CampusRoom;
  schedule?: string;
  faculty_id?: string | null;
  room_id?: string | null;
  schedule_slots?: CourseScheduleSlot[];
  max_seats: number;
  enrolled_count: number;
  course?: AcademicCourse;
  semester?: AcademicSemester;
  faculty?: UserProfile;
}

export type EnrolmentStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "waitlisted"
  | "cancelled"
  | "completed";

export interface CourseEnrolment {
  id: string;
  section_id: string;
  course_id: string;
  student_id: string;
  semester_id?: string;
  academic_semester_id?: string;
  status: EnrolmentStatus;
  rejection_reason?: string | null;
  waitlist_position?: number | null;
  enrolled_at: string;
  evaluated_at?: string | null;
  final_grade?: string | null;
  final_gpa_points?: number | null;
  section?: CourseSection;
  course?: AcademicCourse;
  student?: UserProfile;
  semester?: AcademicSemester;
}

export interface AcademicAssignment {
  id: string;
  section_id: string;
  course_id: string;
  faculty_id?: string;
  created_by?: string;
  title: string;
  instructions: string;
  max_marks: number;
  weightage_pct?: number;
  open_date?: string;
  due_date: string;
  late_submission_allowed?: boolean;
  max_file_size_mb?: number;
  allowed_file_types?: string[];
  submission_types?: string[];
  resubmission_allowed?: boolean;
  status?: "draft" | "published" | "closed";
  is_published?: boolean;
  course?: AcademicCourse;
  section?: CourseSection;
  faculty?: UserProfile;
  submissions_count?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  version: number;
  file_url?: string | null;
  file_name?: string | null;
  submission_text?: string | null;
  submitted_at: string;
  is_late?: boolean;
  file_size_bytes?: number;
  status: "submitted" | "under_evaluation" | "evaluated" | "returned_for_resubmission";
  marks_obtained?: number | null;
  obtained_marks?: number | null;
  faculty_feedback?: string | null;
  feedback?: string | null;
  evaluated_by?: string | null;
  evaluated_at?: string | null;
  student?: UserProfile;
  assignment?: AcademicAssignment;
}

export interface AcademicExamination {
  id: string;
  section_id: string;
  course_id: string;
  faculty_id?: string;
  title: string;
  exam_type: "quiz" | "internal" | "midterm" | "practical" | "final";
  start_time?: string;
  end_time?: string;
  scheduled_start?: string;
  scheduled_end?: string;
  room?: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks?: number;
  weightage_pct?: number;
  is_randomized?: boolean;
  instructions?: string | null;
  status?: "scheduled" | "active" | "completed" | "published";
  is_published?: boolean;
  course?: AcademicCourse;
  section?: CourseSection;
  questions?: ExaminationQuestion[];
}

export interface ExaminationQuestion {
  id: string;
  exam_id?: string;
  question_number?: number;
  question_type: "mcq" | "true_false" | "short_answer" | "descriptive" | "numerical";
  question_text: string;
  options?: Array<{ id: string; text: string }> | null;
  correct_answer?: string | null; // Evaluated server side
  marks?: number;
  max_marks?: number;
  rubric?: string | null;
}

export interface ExaminationAttempt {
  id: string;
  exam_id?: string;
  examination_id?: string;
  student_id: string;
  started_at?: string;
  submitted_at?: string | null;
  total_score?: number | null;
  marks_obtained?: number | null;
  status?: "in_progress" | "submitted" | "evaluated" | "timed_out" | "graded";
  graded_by?: string | null;
  graded_at?: string | null;
  auto_evaluated?: boolean;
  exam?: AcademicExamination;
  student?: UserProfile;
  answers?: ExaminationAnswer[];
}

export interface ExaminationAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  student_answer?: string | null;
  marks_awarded?: number | null;
  is_correct?: boolean | null;
  faculty_remarks?: string | null;
  question?: ExaminationQuestion;
}

export interface AcademicGradeRecord {
  id: string;
  student_id: string;
  section_id: string;
  course_id: string;
  semester_id?: string;
  academic_semester_id?: string;
  component_name?: string;
  marks_obtained?: number;
  max_marks?: number;
  weightage_pct?: number;
  internal_assessment_score?: number;
  continuous_assessment_score?: number;
  final_exam_score?: number;
  total_score?: number;
  letter_grade?: string;
  grade_points?: number;
  credits_earned?: number;
  remarks?: string;
  is_published: boolean;
  published_at?: string | null;
  updated_by?: string | null;
  student?: UserProfile;
  course?: AcademicCourse;
}

export interface AcademicProject {
  id: string;
  title: string;
  description?: string;
  abstract?: string;
  category?: "capstone" | "research" | "industry" | "mini_project";
  project_type?: string;
  programme_id?: string | null;
  department_id: string;
  academic_year_id: string;
  guide_faculty_id?: string | null;
  supervisor_faculty_id?: string | null;
  rubric_scores?: Record<string, number>;
  defense_date?: string | null;
  created_at?: string;
  status:
    | "registered"
    | "abstract_approved"
    | "first_review"
    | "second_review"
    | "final_evaluation"
    | "approved"
    | "revision_required"
    | "rejected"
    | "in_progress";
  department?: Department;
  guide?: UserProfile;
  members?: ProjectTeamMember[];
  reviews?: ProjectReview[];
}

export interface ProjectTeamMember {
  id: string;
  project_id: string;
  student_id: string;
  role: "team_lead" | "member";
  contribution_summary?: string | null;
  student?: UserProfile;
}

export interface ProjectReview {
  id: string;
  project_id: string;
  review_stage: "Abstract Review" | "First Review" | "Second Review" | "Final Evaluation";
  scheduled_date: string;
  status: "scheduled" | "completed" | "deferred";
  panel_faculty_ids?: string[];
  total_score?: number | null;
  max_score: number;
  rubric_breakdown: Record<string, number>;
  feedback_comments?: string | null;
  recommendation: string;
}

export interface AttendanceSession {
  id: string;
  section_id: string;
  course_id?: string;
  faculty_id: string;
  room_id?: string | null;
  session_date: string;
  slot_time?: string;
  start_time?: string;
  end_time?: string;
  topic_covered?: string | null;
  total_present?: number;
  total_absent?: number;
  records?: AttendanceRecord[];
  section?: CourseSection;
  faculty?: UserProfile;
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  status: "present" | "absent" | "late" | "excused";
  notes?: string | null;
  student?: UserProfile;
  session?: AttendanceSession;
}

