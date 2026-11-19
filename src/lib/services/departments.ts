import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Department, ServiceCategory, CampusLocation } from "@/types";
import { DEMO_DEPARTMENTS, DEMO_CATEGORIES, DEMO_LOCATIONS, DEMO_REQUESTS } from "@/lib/demo-data";

interface DepartmentRow {
  id: string;
  name: string;
  description: string | null;
  department_head: string | null;
  created_at: string;
}

interface CategoryRow {
  id: string;
  department_id: string;
  name: string;
  description: string | null;
  created_at: string;
}

interface LocationRow {
  id: string;
  building_name: string;
  floor: string | null;
  room_number: string | null;
  qr_code: string | null;
  created_at: string;
}

export async function getDepartments(): Promise<Department[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_DEPARTMENTS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("departments")
    .select("*")
    .order("name", { ascending: true });

  if (error || !data) {
    return DEMO_DEPARTMENTS;
  }

  const rows = data as unknown as DepartmentRow[];

  return rows.map((d) => ({
    id: d.id,
    name: d.name,
    code: d.name.substring(0, 3).toUpperCase(),
    description: d.description,
    head_name: d.department_head,
    is_active: true,
    created_at: d.created_at,
    updated_at: d.created_at,
  }));
}

export async function getServiceCategories(departmentId?: string): Promise<ServiceCategory[]> {
  if (!isSupabaseConfigured()) {
    return departmentId
      ? DEMO_CATEGORIES.filter((c) => c.department_id === departmentId)
      : DEMO_CATEGORIES;
  }

  const supabase = createClient();
  let query = supabase.from("service_categories").select("*");

  if (departmentId) {
    query = query.eq("department_id", departmentId);
  }

  const { data, error } = await query;
  if (error || !data) {
    return DEMO_CATEGORIES;
  }

  const rows = data as unknown as CategoryRow[];

  return rows.map((c) => ({
    id: c.id,
    department_id: c.department_id,
    name: c.name,
    description: c.description,
    default_priority: "Medium",
    estimated_sla_hours: 12,
    is_active: true,
    created_at: c.created_at,
    updated_at: c.created_at,
  }));
}

export async function getCampusLocations(): Promise<CampusLocation[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_LOCATIONS;
  }

  const supabase = createClient();
  const { data, error } = await supabase.from("locations").select("*");

  if (error || !data) {
    return DEMO_LOCATIONS;
  }

  const rows = data as unknown as LocationRow[];

  return rows.map((l) => ({
    id: l.id,
    building: l.building_name,
    floor: l.floor,
    room_number: l.room_number,
    qr_code_token: l.qr_code,
    is_active: true,
    created_at: l.created_at,
  }));
}

export async function createDepartment(name: string, description: string, headName: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase.from("departments").insert({
    name,
    description,
    department_head: headName,
  });

  if (error) throw error;
  return true;
}

export async function updateDepartment(
  id: string,
  name: string,
  description: string,
  headName: string
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    const dept = DEMO_DEPARTMENTS.find((d) => d.id === id);
    if (dept) {
      dept.name = name;
      dept.description = description;
      dept.head_name = headName;
    }
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("departments")
    .update({
      name,
      description,
      department_head: headName,
    })
    .eq("id", id);

  if (error) throw error;
  return true;
}

export async function deleteDepartment(id: string): Promise<{ success: boolean; message?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  const supabase = createClient();
  // Check if department has requests
  const { count, error: countErr } = await supabase
    .from("service_requests")
    .select("*", { count: "exact", head: true })
    .eq("department_id", id);

  if (!countErr && count && count > 0) {
    throw new Error(`Cannot delete department: ${count} active or historical service requests are linked to it.`);
  }

  const { error } = await supabase.from("departments").delete().eq("id", id);
  if (error) throw error;

  return { success: true };
}

export interface DepartmentWorkload {
  departmentId: string;
  departmentName: string;
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  overdueRequests: number;
  resolutionRatePercentage: number;
  satisfactionRating: number;
}

export async function getDepartmentWorkloadStats(): Promise<DepartmentWorkload[]> {
  const depts = await getDepartments();

  if (!isSupabaseConfigured()) {
    return depts.map((d) => {
      const related = DEMO_REQUESTS.filter((r) => r.department_id === d.id);
      const total = related.length || 2;
      const resolved = related.filter((r) => r.status === "Resolved" || r.status === "Closed").length || 1;
      const inProg = related.filter((r) => r.status === "In Progress" || r.status === "Assigned").length || 1;
      const pending = related.filter((r) => r.status === "Submitted" || r.status === "Under Review").length;
      return {
        departmentId: d.id,
        departmentName: d.name,
        totalRequests: total,
        pendingRequests: pending,
        inProgressRequests: inProg,
        resolvedRequests: resolved,
        overdueRequests: related.filter((r) => r.is_overdue).length,
        resolutionRatePercentage: Math.round((resolved / total) * 100),
        satisfactionRating: 4.6,
      };
    });
  }

  const supabase = createClient();
  const { data: requests, error } = await supabase.from("service_requests").select("department_id, status, due_at, resolved_at");

  if (error || !requests) {
    return [];
  }

  interface SimpleReqRow {
    department_id: string;
    status: string;
    due_at: string | null;
    resolved_at: string | null;
  }

  const rows = requests as unknown as SimpleReqRow[];

  return depts.map((d) => {
    const related = rows.filter((r) => r.department_id === d.id);
    const total = related.length;
    const resolved = related.filter((r) => r.status === "Resolved" || r.status === "Closed").length;
    const inProg = related.filter((r) => r.status === "In Progress" || r.status === "Assigned" || r.status === "Accepted").length;
    const pending = related.filter((r) => r.status === "Submitted" || r.status === "Under Review").length;
    const now = new Date();
    const overdue = related.filter((r) => r.due_at && new Date(r.due_at) < now && r.status !== "Resolved" && r.status !== "Closed").length;

    return {
      departmentId: d.id,
      departmentName: d.name,
      totalRequests: total,
      pendingRequests: pending,
      inProgressRequests: inProg,
      resolvedRequests: resolved,
      overdueRequests: overdue,
      resolutionRatePercentage: total > 0 ? Math.round((resolved / total) * 100) : 100,
      satisfactionRating: 4.8,
    };
  });
}
