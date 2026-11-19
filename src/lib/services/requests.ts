import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ServiceRequest, RequestStatus, RequestPriority, RequestSeverity } from "@/types";
import { DEMO_REQUESTS } from "@/lib/demo-data";

export interface CreateRequestInput {
  title: string;
  description: string;
  departmentId: string;
  categoryId: string;
  locationId: string;
  severity: RequestSeverity;
  priority?: RequestPriority;
  imageUrl?: string;
  dueAt?: string;
}

export async function createServiceRequest(input: CreateRequestInput): Promise<{
  success: boolean;
  data?: { id: string; request_number?: string; title: string };
}> {
  if (!isSupabaseConfigured()) {
    // Demonstration simulated save
    return {
      success: true,
      data: {
        id: `req-${Date.now()}`,
        request_number: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: input.title,
      },
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to submit a service request.");
  }

  const calculatedPriority: RequestPriority =
    input.priority ||
    (input.severity === "Critical"
      ? "Critical"
      : input.severity === "High"
      ? "High"
      : input.severity === "Medium"
      ? "Medium"
      : "Low");

  const { data, error } = await supabase
    .from("service_requests")
    .insert({
      user_id: user.id,
      department_id: input.departmentId,
      category_id: input.categoryId,
      location_id: input.locationId,
      title: input.title,
      description: input.description,
      severity: input.severity,
      priority: calculatedPriority,
      status: "Submitted",
      image_url: input.imageUrl || null,
      due_at: input.dueAt || null,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert initial audit trail
  await supabase.from("request_updates").insert({
    request_id: data.id,
    updated_by: user.id,
    old_status: null,
    new_status: "Submitted",
    comment: "Service request submitted by user.",
  });

  return { success: true, data };
}

export async function getUserServiceRequests(userId?: string): Promise<ServiceRequest[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_REQUESTS;
  }

  const supabase = createClient();
  let query = supabase
    .from("service_requests")
    .select(`
      *,
      department:departments(*),
      category:service_categories(*),
      location:locations(*),
      creator:profiles!service_requests_user_id_fkey(*)
    `)
    .order("created_at", { ascending: false });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("Falling back to demo requests due to query error:", error.message);
    return DEMO_REQUESTS;
  }

  return (data as unknown as ServiceRequest[]) || [];
}

export async function getStaffAssignedRequests(staffId?: string): Promise<ServiceRequest[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_REQUESTS.filter(
      (r) => r.department_id === "dept-facilities" || r.status === "Assigned" || r.status === "In Progress"
    );
  }

  const supabase = createClient();
  let query = supabase
    .from("service_requests")
    .select(`
      *,
      department:departments(*),
      category:service_categories(*),
      location:locations(*),
      creator:profiles!service_requests_user_id_fkey(*)
    `)
    .order("created_at", { ascending: false });

  if (staffId) {
    query = query.eq("assigned_staff_id", staffId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("Falling back to demo requests:", error.message);
    return DEMO_REQUESTS;
  }

  return (data as unknown as ServiceRequest[]) || [];
}

export async function updateServiceRequestStatus(
  requestId: string,
  newStatus: RequestStatus,
  comment: string,
  oldStatus?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const updates: {
    status: RequestStatus;
    updated_at: string;
    resolved_at?: string;
  } = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "Resolved") {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("service_requests")
    .update(updates)
    .eq("id", requestId);

  if (error) throw error;

  // Insert audit record
  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: oldStatus || null,
    new_status: newStatus,
    comment: comment || `Status updated to ${newStatus}`,
  });

  return true;
}

export async function assignRequestToStaff(
  requestId: string,
  staffId: string,
  notes?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const { error } = await supabase
    .from("service_requests")
    .update({
      assigned_staff_id: staffId,
      status: "Assigned",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;

  // Record assignment
  await supabase.from("request_assignments").insert({
    request_id: requestId,
    staff_id: staffId,
    assigned_by: user.id,
  });

  // Record update
  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: "Submitted",
    new_status: "Assigned",
    comment: notes || "Assigned to department staff technician.",
  });

  return true;
}

export async function submitRequestFeedback(
  requestId: string,
  rating: number,
  comment?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const { error } = await supabase.from("feedback").insert({
    request_id: requestId,
    user_id: user.id,
    rating,
    comment: comment || null,
  });

  if (error) throw error;
  return true;
}
