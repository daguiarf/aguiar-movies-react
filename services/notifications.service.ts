import { notificationsRepository } from "@/infra/repositories/notifications.repository";

export const notificationsService = {
  list: (params?: { last_id?: number; limit?: number }) => notificationsRepository.list(params),
  count: () => notificationsRepository.count(),
  get: (id: number) => notificationsRepository.get(id),
  markAsRead: (id: number) => notificationsRepository.markAsRead(id),
  markAllAsRead: () => notificationsRepository.markAllAsRead(),
};
