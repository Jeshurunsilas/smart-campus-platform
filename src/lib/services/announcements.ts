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

export async function getCampusAnnouncements(): Promise<CampusAnnouncement[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_ANNOUNCEMENTS;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

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
    target_roles: ["student", "faculty"],
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
