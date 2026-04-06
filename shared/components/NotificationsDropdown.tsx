"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, MessageSquare, Heart, Star, User, Check } from "lucide-react";
import { useNotifications } from "@/modules/notifications/hooks/useNotifications";
import { Notification } from "@/domain/types/notifications.types";
import { cn } from "@/lib/utils";

function NotificationIcon({ type }: { type: string }) {
  switch (type) {
    case "like":    return <Heart className="w-3.5 h-3.5 text-rose-400" />;
    case "comment": return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
    case "reply":   return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
    case "follow":  return <User className="w-3.5 h-3.5 text-green-400" />;
    default:        return <Star className="w-3.5 h-3.5 text-yellow-400" />;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors group",
        !notification.is_read
          ? "bg-primary/5 hover:bg-primary/10"
          : "hover:bg-accent/60"
      )}
    >
      {/* Type icon */}
      <div className="mt-0.5 w-6 h-6 rounded-full bg-accent flex items-center justify-center shrink-0">
        <NotificationIcon type={notification.notification_type} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm leading-snug line-clamp-2",
          notification.is_read ? "text-muted-foreground" : "text-foreground font-medium"
        )}>
          {notification.message}
        </p>
        {notification.post_title && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {notification.post_title}
          </p>
        )}
        <p className="text-xs text-muted-foreground/60 mt-1">{timeAgo(notification.created_at)}</p>
      </div>

      {/* Mark as read indicator / button */}
      {!notification.is_read && (
        <div className="shrink-0 mt-1 flex items-center">
          {hovered ? (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              title="Marcar como lida"
              className="w-5 h-5 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/80 transition-colors"
            >
              <Check className="w-3 h-3" />
            </button>
          ) : (
            <div className="w-2 h-2 rounded-full bg-primary" />
          )}
        </div>
      )}
    </div>
  );
}

export function NotificationsDropdown() {
  const { notifications, unreadCount, loading, refresh, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleOpen() {
    setOpen((prev) => {
      if (!prev) refresh();
      return !prev;
    });
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
        title="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border/60 bg-background/98 backdrop-blur-md shadow-xl z-50 animate-in slide-in-from-top-2 duration-150 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <span className="text-sm font-semibold text-foreground">Notificações</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                title="Marcar todas como lidas"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="divide-y divide-border/40">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="w-6 h-6 rounded-full bg-accent animate-pulse shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-accent rounded animate-pulse w-3/4" />
                      <div className="h-3 bg-accent rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
                <Bell className="w-8 h-8 opacity-30" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {notifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} onMarkAsRead={markAsRead} />
                ))}
              </div>
            )}
          </div>

          {/* Footer hint for unread items */}
          {!loading && notifications.some((n) => !n.is_read) && (
            <div className="px-4 py-2 border-t border-border/60 bg-accent/30">
              <p className="text-[11px] text-muted-foreground/70 text-center">
                Passe o mouse sobre uma notificação para marcá-la como lida
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
