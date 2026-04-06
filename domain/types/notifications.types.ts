export type NotificationType = "like" | "comment" | "reply" | "follow" | string;

export interface Notification {
  id: number;
  notification_type: NotificationType;
  message: string;
  sender_username: string;
  post_id: number | null;
  post_title: string | null;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsListResponse {
  results: Notification[];
}

export interface NotificationsCount {
  total: number;
  unread: number;
}
