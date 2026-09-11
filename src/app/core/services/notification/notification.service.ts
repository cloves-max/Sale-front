import { Injectable, signal } from '@angular/core';

export type NotificationTone = 'success' | 'error';

export interface AppNotification {
  tone: NotificationTone;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationSignal = signal<AppNotification | null>(null);

  readonly notification = this.notificationSignal.asReadonly();

  success(message: string): void {
    this.notificationSignal.set({ tone: 'success', message });
  }

  error(message: string): void {
    this.notificationSignal.set({ tone: 'error', message });
  }

  clear(): void {
    this.notificationSignal.set(null);
  }
}
