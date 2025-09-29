/* eslint react-refresh/only-export-components: "off" */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { listMyNotifications, markAllRead, markNotificationRead, NotificationRow, subscribeMyNotifications } from '../lib/notifications';
import { useAuth } from './AuthContext';

type Ctx = {
  notifications: NotificationRow[];
  unreadCount: number;
  loading: boolean;
  refresh: () => Promise<void>;
  markOne: (id: string) => Promise<void>;
  markAll: () => Promise<void>;
};

const NotificationsContext = createContext<Ctx | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = React.useCallback(async () => {
    if (!session?.user) { setNotifications([]); return; }
    setLoading(true);
    const { data } = await listMyNotifications(50);
    setNotifications(data);
    setLoading(false);
  }, [session?.user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!session?.user) return;
    const unsub = subscribeMyNotifications(session.user.id, (n: NotificationRow) => {
      setNotifications(prev => [n, ...prev]);
    });
    return () => { unsub(); };
  }, [session?.user]);

  const markOne = React.useCallback(async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  }, []);

  const markAll = React.useCallback(async () => {
    if (!session?.user) return;
    await markAllRead();
    const ts = new Date().toISOString();
    setNotifications(prev => prev.map(n => n.read_at ? n : { ...n, read_at: ts }));
  }, [session?.user]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read_at).length, [notifications]);

  const value = useMemo<Ctx>(() => ({ notifications, unreadCount, loading, refresh, markOne, markAll }), [notifications, unreadCount, loading, refresh, markOne, markAll]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationsProvider');
  return ctx;
};
