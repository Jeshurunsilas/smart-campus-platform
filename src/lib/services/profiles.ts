import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { UserProfile } from "@/types";
import { DEMO_PENDING_APPROVALS, DEMO_USERS } from "@/lib/demo-data";

interface PendingProfileRow {
  id: string;
  full_name: string;
  email: string;
  role: "student" | "faculty" | "administrator" | "department_staff";
  registration_number: string | null;
  faculty_id: string | null;
  department_id: string | null;
  approval_status: "pending" | "approved" | "rejected";
  created_at: string;
  department?: { name: string } | null;
}

export async function getPendingAccountApprovals() {
  if (!isSupabaseConfigured()) {
    return DEMO_PENDING_APPROVALS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      role,
      registration_number,
      faculty_id,
      department_id,
      approval_status,
      created_at,
      department:departments(name)
    `)
    .eq("approval_status", "pending")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return DEMO_PENDING_APPROVALS;
  }

  return (data as unknown as PendingProfileRow[]).map((d) => ({
    id: d.id,
    full_name: d.full_name,
    email: d.email,
    role: (d.role === "faculty" ? "faculty" : "student") as "student" | "faculty",
    student_id: d.registration_number,
    faculty_id: d.faculty_id,
    department_name: d.department?.name || "Unassigned Department",
    submitted_at: d.created_at,
    verification_documents: "Student / Faculty Credentials (Submitted)",
  }));
}

export async function approveUserAccount(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      approval_status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;

  // Insert welcoming notification for the user
  await supabase.from("notifications").insert({
    user_id: userId,
    title: "Account Approved",
    message: "Your campus account has been approved by the administrator. You now have full access.",
  });

  return true;
}

export async function rejectUserAccount(userId: string, reason?: string): Promise<boolean> {
  void reason;
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      approval_status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;
  return true;
}

export async function getAllUserProfiles(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) {
    return Object.values(DEMO_USERS);
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return Object.values(DEMO_USERS);
  }

  return data as unknown as UserProfile[];
}

export interface UpdateProfileInput {
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
}

export async function updateUserProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<{ success: boolean; message: string }> {
  const matching = Object.values(DEMO_USERS).find(
    (u) =>
      u.id === userId ||
      (userId === "usr-student-01" && u.role === "student") ||
      (userId === "usr-faculty-01" && u.role === "faculty")
  );

  if (!isSupabaseConfigured()) {
    if (matching) {
      if (input.full_name) matching.full_name = input.full_name;
      if (input.phone_number !== undefined) matching.phone_number = input.phone_number;
      if (input.avatar_url) matching.avatar_url = input.avatar_url;
    }
    return { success: true, message: "Profile updated successfully." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    if (matching) {
      if (input.full_name) matching.full_name = input.full_name;
      if (input.phone_number !== undefined) matching.phone_number = input.phone_number;
      if (input.avatar_url) matching.avatar_url = input.avatar_url;
      return { success: true, message: "Profile updated successfully." };
    }
    throw new Error("Unauthorized: You can only update your own profile.");
  }

  const allowedUpdates: {
    full_name?: string;
    avatar_url?: string;
    updated_at: string;
  } = {
    updated_at: new Date().toISOString(),
  };

  if (input.full_name && input.full_name.trim()) {
    allowedUpdates.full_name = input.full_name.trim();
  }
  if (input.avatar_url) {
    allowedUpdates.avatar_url = input.avatar_url;
  }

  const { error } = await supabase
    .from("profiles")
    .update(allowedUpdates)
    .eq("id", userId);

  if (error) throw error;

  return { success: true, message: "Profile updated successfully." };
}

export async function getRegisteredUsers(
  searchTerm: string = "",
  roleFilter: string = "all",
  statusFilter: string = "all"
): Promise<UserProfile[]> {
  if (!isSupabaseConfigured()) {
    return Object.values(DEMO_USERS).filter((u) => {
      const matchSearch =
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.approval_status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }

  const supabase = createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });

  if (roleFilter !== "all") {
    query = query.eq("role", roleFilter as "student" | "faculty" | "administrator" | "department_staff");
  }
  if (statusFilter !== "all") {
    query = query.eq("approval_status", statusFilter as "pending" | "approved" | "rejected");
  }

  const { data, error } = await query;
  if (error || !data) {
    return Object.values(DEMO_USERS);
  }

  let results = data as unknown as UserProfile[];
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    results = results.filter(
      (u) =>
        u.full_name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
    );
  }

  return results;
}

export async function toggleUserStatus(
  userId: string,
  newStatusOrActive: "approved" | "rejected" | "pending" | boolean
): Promise<{ success: boolean; status: string }> {
  let status: "approved" | "rejected" | "pending";
  if (typeof newStatusOrActive === "boolean") {
    status = newStatusOrActive ? "approved" : "rejected";
  } else {
    status = newStatusOrActive;
  }

  if (!isSupabaseConfigured()) {
    const user = Object.values(DEMO_USERS).find((u) => u.id === userId);
    if (user) user.approval_status = status;
    return { success: true, status };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      approval_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) throw error;

  await supabase.from("notifications").insert({
    user_id: userId,
    title: `Account Status Changed: ${status.toUpperCase()}`,
    message: `Your campus platform account status has been updated to ${status} by an administrator.`,
  });

  return { success: true, status };
}

export interface ProvisionStaffInput {
  full_name?: string;
  fullName?: string;
  email: string;
  department_id?: string;
  departmentId?: string;
  role?: "administrator" | "department_staff";
  staffId?: string;
  phoneNumber?: string;
}

export async function provisionStaffAccount(input: ProvisionStaffInput): Promise<{
  success: boolean;
  id?: string;
  staffProfile?: {
    id: string;
    full_name: string;
    email: string;
    role: string;
    department_id: string;
    approval_status: string;
  };
}> {
  const resolvedName = input.fullName || input.full_name || "New Staff Member";
  const resolvedDept = input.departmentId || input.department_id || "dept-facilities";
  const resolvedRole = input.role || "department_staff";
  const newId = `staff-${Date.now()}`;

  const staffProfile = {
    id: newId,
    full_name: resolvedName,
    email: input.email,
    role: resolvedRole,
    department_id: resolvedDept,
    approval_status: "approved",
  };

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      id: newId,
      staffProfile,
    };
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: crypto.randomUUID(),
      full_name: resolvedName,
      email: input.email,
      role: resolvedRole,
      department_id: resolvedDept,
      approval_status: "approved",
    })
    .select("id")
    .single();

  if (error) throw error;
  return {
    success: true,
    id: data.id,
    staffProfile: {
      ...staffProfile,
      id: data.id,
    },
  };
}
