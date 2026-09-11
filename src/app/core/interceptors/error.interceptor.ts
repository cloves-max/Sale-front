import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);
  const isAuthEndpoint = request.url.includes('/auth/login') || request.url.includes('/auth/register');

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      const apiMessage = extractApiMessage(error);

      if (error.status === 401 && !isAuthEndpoint) {
        authService.logout();
        notificationService.error(apiMessage || 'Session expired. Please sign in again.');
      } else if (error.status === 403) {
        notificationService.error(apiMessage || 'You do not have permission to perform this action.');
      } else if (!isAuthEndpoint) {
        notificationService.error(apiMessage || 'Unexpected server error. Please try again.');
      }

      return throwError(() => error);
    }),
  );
};

function extractApiMessage(error: HttpErrorResponse): string | null {
  const payload = error.error as { message?: string } | string | null;

  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === 'object' && typeof payload.message === 'string') {
    return payload.message;
  }

  return null;
}
