import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { CampusAnnouncement } from "@/types";
import { DEMO_ANNOUNCEMENTS } from "@/lib/demo-data";

interface AnnouncementRow {
  id: string;
  title: string;
  content: string;
  created_by: string;
  target_audience: string;
  created_at: string;
}

export async function getCampusAnnouncements(
  targetRole?: "student" | "faculty" | "all"
): Promise<CampusAnnouncement[]> {
  if (!isSupabaseConfigured()) {
    if (!targetRole || targetRole === "all") {
      return DEMO_ANNOUNCEMENTS;
    }
    return DEMO_ANNOUNCEMENTS.filter((a) => {
      const roles = a.target_roles || [];
      return (
        roles.includes(targetRole) ||
        roles.includes("all" as unknown as typeof targetRole)
      );
    });
  }

  const supabase = createClient();
  let query = supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (targetRole && targetRole !== "all") {
    query = query.or(`target_audience.eq.all,target_audience.eq.${targetRole}`);
  }

  const { data, error } = await query;
  if (error || !data) {
    return DEMO_ANNOUNCEMENTS;
  }

  const rows = data as unknown as AnnouncementRow[];

  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    category: "General",
    priority: "medium",
    target_roles:
      a.target_audience === "all"
        ? ["student", "faculty"]
        : [a.target_audience as "student" | "faculty"],
    published_by: a.created_by,
    is_published: true,
    created_at: a.created_at,
  }));
}

export async function createCampusAnnouncement(
  title: string,
  content: string,
  targetAudience: string = "all"
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const { error } = await supabase.from("announcements").insert({
    title,
    content,
    created_by: user.id,
    target_audience: targetAudience as "all" | "student" | "faculty" | "department_staff",
  });

  if (error) throw error;
  return true;
}

export async function deleteCampusAnnouncement(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
  return true;
}
