import {
  Notification,
  NotificationsCount,
  NotificationsListResponse,
} from "@/domain/types/notifications.types";

export interface INotificationsRepository {
  list(params?: { last_id?: number; limit?: number }): Promise<NotificationsListResponse>;
  count(): Promise<NotificationsCount>;
  get(id: number): Promise<Notification>;
  markAsRead(id: number): Promise<Notification>;
  markAllAsRead(): Promise<void>;
}
