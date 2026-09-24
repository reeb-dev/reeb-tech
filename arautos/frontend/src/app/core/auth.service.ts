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

  private persist(res: AuthResponse) {
    localStorage.setItem(KEY, JSON.stringify(res));
    this.session.set(res);
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
