import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { TenantProfile } from '../../core/models';

@Component({
  selector: 'app-panel-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent implements OnInit {
  pending = signal<TenantProfile[]>([]);
  tenants = signal<TenantProfile[]>([]);
  error = signal('');
  ok = signal('');
  busyId = signal<string | null>(null);

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.error.set('');
    this.api.adminPendingTenants().subscribe({
      next: (list) => this.pending.set(list),
      error: (e) => this.error.set(e.error?.error || 'No se pudieron cargar las altas pendientes')
    });
    this.api.adminTenants().subscribe({
      next: (list) => this.tenants.set(list),
      error: (e) => this.error.set(e.error?.error || 'No se pudo cargar el listado de concesionarias')
    });
  }

  approve(id: string) {
    this.busyId.set(id);
    this.error.set('');
    this.ok.set('');
    this.api.adminApproveTenant(id).subscribe({
      next: () => {
        this.busyId.set(null);
        this.ok.set('Concesionaria aprobada. Ya puede usar el trial.');
        this.reload();
      },
      error: (e) => {
        this.busyId.set(null);
        this.error.set(e.error?.error || 'No se pudo aprobar');
      }
    });
  }

  suspend(id: string) {
    if (!confirm('¿Suspender esta concesionaria? Sus avisos dejarán de listarse en el catálogo.')) {
      return;
    }
    this.busyId.set(id);
    this.error.set('');
    this.ok.set('');
    this.api.adminSuspendTenant(id).subscribe({
      next: () => {
        this.busyId.set(null);
        this.ok.set('Concesionaria suspendida.');
        this.reload();
      },
      error: (e) => {
        this.busyId.set(null);
        this.error.set(e.error?.error || 'No se pudo suspender');
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/panel/login');
  }

  moderationLabel(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'Pendiente de alta';
      case 'ACTIVA': return 'Activa';
      case 'SUSPENDIDA': return 'Suspendida';
      default: return status;
    }
  }

  subscriptionLabel(status: string): string {
    switch (status) {
      case 'TRIAL': return 'Trial';
      case 'ACTIVA': return 'Activa';
      case 'PENDIENTE_PAGO': return 'Pendiente de pago';
      case 'VENCIDA': return 'Vencida';
      case 'SUSPENDIDA': return 'Suspendida';
      default: return status;
    }
  }
}
