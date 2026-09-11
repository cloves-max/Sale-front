import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constant';
import { AuthenticatedUser } from '@core/models/auth.model';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  saveSession(accessToken: string, user: AuthenticatedUser): void {
    localStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.accessToken);
  }

  getCurrentUser(): AuthenticatedUser | null {
    const rawUser = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthenticatedUser;
    } catch {
      this.clearSession();
      return null;
    }
  }
}
