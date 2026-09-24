import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { AuthResponse } from '../../core/models';

@Component({
  selector: 'app-oauth-callback',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="container narrow">
      <h1>Ingreso con Facebook</h1>
      @if (error()) {
        <div class="alert">{{ error() }}</div>
        <p class="meta"><a routerLink="/panel/login">Volver al ingreso</a></p>
      } @else {
        <p class="meta">{{ message() || 'Sesión iniciada. Redirigiendo…' }}</p>
      }
    </section>
  `
})
export class OAuthCallbackComponent implements OnInit {
  error = signal('');
  message = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const q = this.route.snapshot.queryParamMap;
    const oauthError = q.get('oauth_error');
    if (oauthError) {
      this.error.set(this.describe(oauthError));
      return;
    }
    const token = q.get('token');
    if (!token) {
      this.error.set('No se recibió token de Facebook.');
      return;
    }
    const session: AuthResponse = {
      token,
      userId: q.get('userId') || '',
      email: q.get('email') || '',
      role: q.get('role') || 'TENANT_ADMIN',
      tenantId: q.get('tenantId') || undefined,
      tenantSlug: q.get('tenantSlug') || undefined,
      tenantName: q.get('tenantName') || undefined,
      subscriptionStatus: q.get('subscriptionStatus') || undefined,
      moderationStatus: q.get('moderationStatus') || undefined,
      message: q.get('message') || undefined
    };
    this.auth.acceptToken(token, session);
    this.message.set(session.message || 'Bienvenido.');
    setTimeout(() => this.router.navigateByUrl(this.auth.homePath()), 400);
  }

  private describe(code: string): string {
    switch (code) {
      case 'not_configured':
        return 'Facebook Login no está configurado en el servidor.';
      case 'meta_denied':
        return 'No se autorizó el acceso en Facebook.';
      case 'invalid_state':
        return 'La sesión OAuth expiró. Intente de nuevo.';
      default:
        return 'No se pudo completar el ingreso con Facebook (' + code + ').';
    }
  }
}
