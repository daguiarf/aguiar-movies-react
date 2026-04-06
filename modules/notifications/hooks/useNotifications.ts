"use client";

import { useCallback, useEffect, useState } from "react";
import { notificationsService } from "@/services/notifications.service";
import { Notification } from "@/domain/types/notifications.types";

const POLL_INTERVAL = 60_000; // 1 min

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCount = useCallback(async () => {
    try {
      const { unread } = await notificationsService.count();
      setUnreadCount(unread ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  const loadList = useCallback(async () => {
    try {
      setLoading(true);
      const { results } = await notificationsService.list({ limit: 20 });
      setNotifications(results ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCount();
    loadList();
  }, [loadCount, loadList]);

  useEffect(() => {
    const interval = setInterval(loadCount, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadCount]);

  async function refresh() {
    await Promise.all([loadCount(), loadList()]);
  }

  async function markAsRead(id: number) {
    try {
      const updated = await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updated, is_read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  }

  async function markAllAsRead() {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  }

  return { notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead };
}
