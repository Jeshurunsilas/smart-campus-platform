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

  // Notify the user of successful submission
  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "Service Request Submitted",
    message: `Your request "${input.title}" (${data.request_number}) was submitted successfully.`,
    related_request_id: data.id,
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

export function isRequestCancellable(status: RequestStatus): boolean {
  return status === "Submitted" || status === "Under Review";
}

export async function cancelServiceRequest(
  requestId: string,
  reason: string = "Cancelled by requestor"
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    if (req && !isRequestCancellable(req.status)) {
      throw new Error(`Requests with status '${req.status}' cannot be cancelled.`);
    }
    if (req) {
      req.status = "Closed";
    }
    return { success: true, message: "Request cancelled successfully." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to cancel a request.");
  }

  const { data: request, error: fetchError } = await supabase
    .from("service_requests")
    .select("status, user_id, title")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    throw new Error("Service request not found.");
  }

  if (request.user_id !== user.id) {
    throw new Error("Unauthorized: You can only cancel your own service requests.");
  }

  if (!isRequestCancellable(request.status)) {
    throw new Error(
      `Requests with status '${request.status}' cannot be cancelled directly. Please contact department staff.`
    );
  }

  const { error: updateError } = await supabase
    .from("service_requests")
    .update({
      status: "Closed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (updateError) throw updateError;

  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: request.status,
    new_status: "Closed",
    comment: `Request cancelled by user. Reason: ${reason}`,
  });

  await supabase.from("notifications").insert({
    user_id: user.id,
    title: "Request Cancelled",
    message: `Your request "${request.title}" has been cancelled.`,
    related_request_id: requestId,
  });

  return { success: true, message: "Request cancelled successfully." };
}

export interface RequestUpdateItem {
  id: string;
  request_id: string;
  updated_by: string;
  old_status: string | null;
  new_status: string;
  comment: string;
  created_at: string;
}

export async function getRequestUpdates(requestId: string): Promise<RequestUpdateItem[]> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    const updates: RequestUpdateItem[] = [
      {
        id: `upd-1-${requestId}`,
        request_id: requestId,
        updated_by: req?.creator?.full_name || "Requestor",
        old_status: null,
        new_status: "Submitted",
        comment: "Service request registered in system.",
        created_at: req?.created_at || new Date().toISOString(),
      },
    ];

    if (req && req.status !== "Submitted") {
      updates.push({
        id: `upd-2-${requestId}`,
        request_id: requestId,
        updated_by: "Campus Operations",
        old_status: "Submitted",
        new_status: req.status === "Closed" ? "Closed" : "In Progress",
        comment: req.status === "Closed" ? "Request closed by requestor." : `Dispatched to ${req.department?.name || "Maintenance"}.`,
        created_at: req.updated_at || new Date().toISOString(),
      });
    }

    if (req && (req.status === "Resolved" || req.status === "Closed") && req.resolved_at) {
      updates.push({
        id: `upd-3-${requestId}`,
        request_id: requestId,
        updated_by: "Department Staff",
        old_status: "In Progress",
        new_status: req.status,
        comment: "Work verified and completed.",
        created_at: req.resolved_at,
      });
    }

    return updates;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("request_updates")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as RequestUpdateItem[];
}

export async function getAllRequestsAdmin(): Promise<ServiceRequest[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_REQUESTS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("service_requests")
    .select(`
      *,
      department:departments(*),
      category:service_categories(*),
      location:locations(*),
      creator:profiles!service_requests_user_id_fkey(*)
    `)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return DEMO_REQUESTS;
  }

  return (data as unknown as ServiceRequest[]) || [];
}

export async function updateRequestPriority(
  requestId: string,
  newPriority: RequestPriority,
  reason?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    if (req) req.priority = newPriority;
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
      priority: newPriority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;

  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: null,
    new_status: "Priority Adjusted",
    comment: `Priority changed to ${newPriority}. Reason: ${reason || "Administrative review."}`,
  });

  return true;
}

export async function acceptRequestAssignment(requestId: string, notes?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    if (req) req.status = "Accepted";
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
      status: "Accepted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;

  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: "Assigned",
    new_status: "Accepted",
    comment: notes || "Technician acknowledged and accepted task.",
  });

  return true;
}

export async function startRequestWork(requestId: string, notes?: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    if (req) req.status = "In Progress";
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
      status: "In Progress",
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;

  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: "Accepted",
    new_status: "In Progress",
    comment: notes || "Work begun on-site by service personnel.",
  });

  return true;
}

export async function rejectRequestAssignment(requestId: string, reason: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    if (req) {
      req.status = "Under Review";
      req.assigned_staff_id = null;
    }
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
      status: "Under Review",
      assigned_staff_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId);

  if (error) throw error;

  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: "Assigned",
    new_status: "Under Review",
    comment: `Assignment declined by technician. Reason: ${reason}`,
  });

  return true;
}

export async function addRequestWorkNote(requestId: string, note: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const { error } = await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: null,
    new_status: "Work Note",
    comment: note,
  });

  return !error;
}

export async function resolveServiceRequest(
  requestId: string,
  resolutionDetails: string,
  completionPhotoUrl?: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const req = DEMO_REQUESTS.find((r) => r.id === requestId);
    if (req) {
      req.status = "Resolved";
      req.resolved_at = new Date().toISOString();
    }
    return true;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const now = new Date().toISOString();
  const { data: request, error: fetchErr } = await supabase
    .from("service_requests")
    .select("user_id, title")
    .eq("id", requestId)
    .single();

  if (fetchErr || !request) throw new Error("Service request not found.");

  const { error } = await supabase
    .from("service_requests")
    .update({
      status: "Resolved",
      resolved_at: now,
      updated_at: now,
    })
    .eq("id", requestId);

  if (error) throw error;

  await supabase.from("request_updates").insert({
    request_id: requestId,
    updated_by: user.id,
    old_status: "In Progress",
    new_status: "Resolved",
    comment: `Service completed: ${resolutionDetails}${completionPhotoUrl ? " [Completion Photo Attached]" : ""}`,
  });

  // Notify the original creator
  await supabase.from("notifications").insert({
    user_id: request.user_id,
    title: "Service Request Resolved",
    message: `Your request "${request.title}" has been completed. Please rate your service satisfaction.`,
    related_request_id: requestId,
  });

  return true;
}
