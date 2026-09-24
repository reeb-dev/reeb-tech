import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthResponse } from './models';

const KEY = 'arautos_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly session = signal<AuthResponse | null>(this.read());

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => this.persist(res))
    );
  }

  register(body: Record<string, unknown>) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, body).pipe(
      tap((res) => this.persist(res))
    );
  }

  logout() {
    localStorage.removeItem(KEY);
    this.session.set(null);
  }

  token(): string | null {
    return this.session()?.token ?? null;
  }

  role(): string | null {
    return this.session()?.role ?? null;
  }

  isLoggedIn(): boolean {
    return !!this.session()?.token;
  }

  isPlatformAdmin(): boolean {
    return this.role() === 'PLATFORM_ADMIN';
  }

  isTenantAdmin(): boolean {
    return this.role() === 'TENANT_ADMIN';
  }

  isTenantUser(): boolean {
    const r = this.role();
    return r === 'TENANT_ADMIN' || r === 'TENANT_AGENT';
  }

  roleLabel(role?: string | null): string {
    switch (role || this.role()) {
      case 'PLATFORM_ADMIN':
        return 'Administrador de plataforma';
      case 'TENANT_ADMIN':
        return 'Administrador del local';
      case 'TENANT_AGENT':
        return 'Agente';
      default:
        return role || 'Usuario';
    }
  }

  homePath(): string {
    return this.isPlatformAdmin() ? '/panel/admin' : '/panel';
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(KEY, JSON.stringify(res));
    this.session.set(res);
  }

  /** Persiste JWT recibido del callback OAuth (Facebook Login). */
  acceptToken(token: string, extras?: Partial<AuthResponse>) {
    const res: AuthResponse = {
      token,
      userId: extras?.userId || '',
      email: extras?.email || '',
      role: extras?.role || 'TENANT_ADMIN',
      tenantId: extras?.tenantId,
      tenantSlug: extras?.tenantSlug,
      tenantName: extras?.tenantName,
      subscriptionStatus: extras?.subscriptionStatus,
      moderationStatus: extras?.moderationStatus,
      message: extras?.message
    };
    this.persist(res);
  }

  private read(): AuthResponse | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
