import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { InAppNotification } from "@/types";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";

interface NotificationRow {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  related_request_id: string | null;
  created_at: string;
}

export async function getUserNotifications(userId?: string): Promise<InAppNotification[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_NOTIFICATIONS;
  }

  const supabase = createClient();
  const targetId = userId || (await supabase.auth.getUser()).data.user?.id;

  if (!targetId) return [];

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", targetId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return DEMO_NOTIFICATIONS;
  }

  const rows = data as unknown as NotificationRow[];

  return rows.map((n) => ({
    id: n.id,
    user_id: n.user_id,
    title: n.title,
    message: n.message,
    type: "status_change",
    read: n.is_read,
    request_id: n.related_request_id,
    created_at: n.created_at,
  }));
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return true;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  return !error;
}

export function subscribeToNotifications(userId: string, onNewNotification: (notif: InAppNotification) => void) {
  if (!isSupabaseConfigured()) {
    return { unsubscribe: () => {} };
  }

  const supabase = createClient();
  const channel = supabase
    .channel(`notifications-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const row = payload.new as NotificationRow;
        onNewNotification({
          id: row.id,
          user_id: row.user_id,
          title: row.title,
          message: row.message,
          type: "status_change",
          read: row.is_read,
          request_id: row.related_request_id,
          created_at: row.created_at,
        });
      }
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
