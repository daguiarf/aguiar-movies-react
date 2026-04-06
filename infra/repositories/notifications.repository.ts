import api from "@/infra/http/api";
import { unwrap } from "@/infra/http/unwrap";
import { INotificationsRepository } from "@/domain/contracts/notifications.contracts";
import {
  Notification,
  NotificationsCount,
  NotificationsListResponse,
} from "@/domain/types/notifications.types";

export class NotificationsRepository implements INotificationsRepository {
  async list(params?: { last_id?: number; limit?: number }): Promise<NotificationsListResponse> {
    const { data } = await api.get("/api/notifications/", { params });
    const raw = unwrap<Notification[] | NotificationsListResponse>(data);
    if (Array.isArray(raw)) return { results: raw };
    return raw as NotificationsListResponse;
  }

  async count(): Promise<NotificationsCount> {
    const { data } = await api.get("/api/notifications/count/");
    return unwrap<NotificationsCount>(data);
  }

  async get(id: number): Promise<Notification> {
    const { data } = await api.get(`/api/notifications/${id}/`);
    return unwrap<Notification>(data);
  }

  async markAsRead(id: number): Promise<Notification> {
    const { data } = await api.patch(`/api/notifications/${id}/read/`);
    return unwrap<Notification>(data);
  }

  async markAllAsRead(): Promise<void> {
    await api.patch("/api/notifications/read-all/");
  }
}

export const notificationsRepository = new NotificationsRepository();
