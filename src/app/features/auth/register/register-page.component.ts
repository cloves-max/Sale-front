import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserRole } from '@core/models/role.model';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/notification/notification.service';
import { resolveErrorMessage } from '@core/utils/error-message.util';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  readonly roleOptions = [
    {
      value: 'SELLER' as UserRole,
      label: 'Vendedor',
      hint: 'Cria e acompanha vendas',
    },
    {
      value: 'ADMIN' as UserRole,
      label: 'Administrador',
      hint: 'Gerencia produtos e usuários',
    },
  ];
  readonly isSubmitting = signal(false);
  readonly formError = signal<string | null>(null);

  readonly registerForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    role: ['SELLER' as UserRole, [Validators.required]],
  });

  submit(): void {
    this.formError.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    this.authService.register(this.registerForm.getRawValue()).subscribe({
      next: () => {
        this.notificationService.success('Conta criada com sucesso');
        void this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        this.formError.set(resolveErrorMessage(error, 'Não foi possível registrar'));
        this.isSubmitting.set(false);
      },
      complete: () => this.isSubmitting.set(false),
    });
  }
}
