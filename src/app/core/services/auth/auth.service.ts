import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import {
  AuthenticatedUser,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@core/models/auth.model';
import { AuthApiService } from '@core/services/api/auth-api.service';
import { TokenStorageService } from '@core/services/auth/token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApiService = inject(AuthApiService);
  private readonly tokenStorageService = inject(TokenStorageService);
  private readonly router = inject(Router);

  private readonly currentUserSignal = signal<AuthenticatedUser | null>(
    this.tokenStorageService.getCurrentUser(),
  );

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.authApiService.login(credentials).pipe(tap((response) => this.persistSession(response)));
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.authApiService
      .register(payload)
      .pipe(tap((response) => this.persistSession(response)));
  }

  logout(): void {
    this.tokenStorageService.clearSession();
    this.currentUserSignal.set(null);
    void this.router.navigate(['/auth/login']);
  }

  getAccessToken(): string | null {
    return this.tokenStorageService.getAccessToken();
  }

  private persistSession(authResponse: AuthResponse): void {
    const authenticatedUser: AuthenticatedUser = {
      userId: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    };

    this.tokenStorageService.saveSession(authResponse.accessToken, authenticatedUser);
    this.currentUserSignal.set(authenticatedUser);
  }
}
