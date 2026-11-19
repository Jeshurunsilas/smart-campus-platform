import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Department, ServiceCategory, CampusLocation } from "@/types";
import { DEMO_DEPARTMENTS, DEMO_CATEGORIES, DEMO_LOCATIONS } from "@/lib/demo-data";

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
