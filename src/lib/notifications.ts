import { supabase } from './supabase';

export type NotificationRow = {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: 'application_created' | 'application_accepted' | 'application_rejected' | 'project_completed' | 'review_received' | string;
  payload: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

export async function listMyNotifications(limit = 20): Promise<{ data: NotificationRow[]; error: string | null }>{
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  return { data: (data as NotificationRow[] | null) ?? [], error: error?.message ?? null };
}

export async function markNotificationRead(id: string): Promise<{ error: string | null }>{
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
  return { error: error?.message ?? null };
}

export async function markAllRead(): Promise<{ error: string | null }>{
  // RLS ensures only own rows are affected; optional userId not needed for query.
  const { error } = await supabase.from('notifications').update({ read_at: new Date().toISOString() }).is('read_at', null);
  return { error: error?.message ?? null };
}

export function subscribeMyNotifications(userId: string, cb: (n: NotificationRow) => void) {
  // Filter at the source; RLS doesn't apply to realtime
  const channel = supabase
    .channel(`notifications:me:${userId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
      cb(payload.new as NotificationRow);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function formatNotification(n: NotificationRow): { title: string; body?: string; href?: string }{
  switch (n.type) {
    case 'application_created':
      return { title: 'New application', body: 'A student applied to your project.', href: n.payload?.project_id ? `/projects/${n.payload.project_id}/applications` : undefined };
    case 'application_accepted':
      return { title: 'Application accepted', body: 'You were accepted to a project.', href: n.payload?.project_id ? `/projects/${n.payload.project_id}` : undefined };
    case 'application_rejected':
      return { title: 'Application rejected', body: 'Your application was not selected.', href: n.payload?.project_id ? `/projects/${n.payload.project_id}` : undefined };
    case 'project_completed':
      return { title: 'Project completed', body: 'A project you joined was marked as completed.', href: n.payload?.project_id ? `/projects/${n.payload.project_id}` : undefined };
    case 'review_received':
      return { title: 'New review received', body: 'A mentor left feedback on your work.', href: n.payload?.project_id ? `/projects/${n.payload.project_id}` : undefined };
    default:
      return { title: 'Notification', body: undefined };
  }
}
