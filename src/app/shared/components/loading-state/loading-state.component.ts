import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading-state" role="status" aria-live="polite">
      <span class="loading-state__dot"></span>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: `
    .loading-state {
      display: grid;
      justify-items: center;
      gap: 0.75rem;
      padding: 2rem;
      color: var(--color-muted);
    }

    .loading-state__dot {
      width: 2rem;
      height: 2rem;
      border-radius: 999px;
      border: 3px solid rgba(15, 107, 76, 0.2);
      border-top-color: var(--color-accent);
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoadingStateComponent {
  readonly message = input('Loading...');
}
