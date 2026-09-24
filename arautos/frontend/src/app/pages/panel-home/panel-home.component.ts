import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import {
  CreatePanelUserRequest,
  PanelUser,
  ProfileUpdateRequest,
  Stats,
  TenantProfile,
  VehiclePanel,
  VehicleRequest,
  BillingStatus,
  RankingResponse
} from '../../core/models';
import { formatPrice, typeLabel } from '../../core/format';
import { GeoSelectComponent } from '../../shared/geo-select.component';

@Component({
  selector: 'app-panel-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GeoSelectComponent],
  templateUrl: './panel-home.component.html',
  styleUrl: './panel-home.component.css'
})
export class PanelHomeComponent implements OnInit {
  vehicles = signal<VehiclePanel[]>([]);
  stats = signal<Stats | null>(null);
  profile = signal<TenantProfile | null>(null);
  billing = signal<BillingStatus | null>(null);
  ranking = signal<RankingResponse | null>(null);
  users = signal<PanelUser[]>([]);
  error = signal('');
  ok = signal('');
  formatPrice = formatPrice;
  typeLabel = typeLabel;
  photoUrl = '';
  checkoutBusy = false;

  invite: CreatePanelUserRequest = {
    email: '',
    password: '',
    role: 'TENANT_AGENT'
  };

  profileForm: ProfileUpdateRequest & { slug?: string } = {
    name: '', logoUrl: '', primaryColor: '#0f2744', accentColor: '#2563eb',
    province: '', city: '', address: '', whatsapp: '', email: '', description: '',
    slug: ''
  };

  form: VehicleRequest = {
    brand: '', model: '', version: '', year: new Date().getFullYear(), km: 0,
    type: 'USADO', price: 0, currency: 'USD', photos: [],
    province: '', city: '', fuel: 'nafta', transmission: 'manual', color: '',
    description: '', status: 'PUBLICADO'
  };

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.myVehicles().subscribe({ next: (v) => this.vehicles.set(v), error: (e) => this.error.set(e.error?.error || 'Error stock') });
    this.api.stats().subscribe({ next: (s) => this.stats.set(s) });
    this.api.billingStatus().subscribe({ next: (b) => this.billing.set(b) });
    this.api.ranking().subscribe({ next: (r) => this.ranking.set(r), error: () => this.ranking.set(null) });
    this.api.profile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.form.province = p.province;
        this.form.city = p.city;
        this.profileForm = {
          name: p.name,
          logoUrl: p.logoUrl || '',
          primaryColor: p.primaryColor || '#0f2744',
          accentColor: p.accentColor || '#2563eb',
          province: p.province,
          city: p.city,
          address: p.address || '',
          whatsapp: p.whatsapp,
          email: p.email || '',
          description: p.description || '',
          slug: p.slug
        };
      }
    });
    if (this.auth.isTenantAdmin()) {
      this.loadUsers();
    }
  }

  loadUsers() {
    this.api.panelUsers().subscribe({
      next: (list) => this.users.set(list),
      error: (e) => this.error.set(e.error?.error || 'No se pudieron cargar los usuarios')
    });
  }

  inviteUser() {
    this.error.set('');
    this.ok.set('');
    this.api.createPanelUser(this.invite).subscribe({
      next: () => {
        this.ok.set('Usuario dado de alta. Entregue el email y la contraseña a la persona.');
        this.invite = { email: '', password: '', role: 'TENANT_AGENT' };
        this.loadUsers();
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo dar de alta el usuario')
    });
  }

  changeRole(user: PanelUser, role: 'TENANT_ADMIN' | 'TENANT_AGENT') {
    this.error.set('');
    this.ok.set('');
    this.api.updatePanelUserRole(user.id, role).subscribe({
      next: () => {
        this.ok.set('Rol actualizado.');
        this.loadUsers();
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo cambiar el rol')
    });
  }

  toggleActive(user: PanelUser) {
    this.error.set('');
    this.ok.set('');
    const req = user.active
      ? this.api.deactivatePanelUser(user.id)
      : this.api.activatePanelUser(user.id);
    req.subscribe({
      next: () => {
        this.ok.set(user.active ? 'Usuario desactivado.' : 'Usuario reactivado.');
        this.loadUsers();
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo cambiar el estado')
    });
  }

  removeUser(user: PanelUser) {
    if (!confirm(`¿Borrar definitivamente a ${user.email}?`)) {
      return;
    }
    this.error.set('');
    this.ok.set('');
    this.api.deletePanelUser(user.id).subscribe({
      next: () => {
        this.ok.set('Usuario borrado.');
        this.loadUsers();
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo borrar')
    });
  }

  startCheckout() {
    this.error.set('');
    this.ok.set('');
    this.checkoutBusy = true;
    this.api.billingCheckout().subscribe({
      next: (res) => {
        this.checkoutBusy = false;
        if (res.initPoint || res.sandboxInitPoint) {
          window.location.href = (res.initPoint || res.sandboxInitPoint)!;
          return;
        }
        this.ok.set(res.message || 'Checkout no disponible todavía.');
        this.api.billingStatus().subscribe({ next: (b) => this.billing.set(b) });
      },
      error: (e) => {
        this.checkoutBusy = false;
        this.error.set(e.error?.error || 'No se pudo iniciar el checkout');
      }
    });
  }

  saveProfile() {
    this.error.set('');
    this.ok.set('');
    const body: ProfileUpdateRequest = {
      name: this.profileForm.name,
      logoUrl: this.profileForm.logoUrl,
      primaryColor: this.profileForm.primaryColor,
      accentColor: this.profileForm.accentColor,
      province: this.profileForm.province,
      city: this.profileForm.city,
      address: this.profileForm.address,
      whatsapp: this.profileForm.whatsapp,
      email: this.profileForm.email,
      description: this.profileForm.description
    };
    this.api.updateProfile(body).subscribe({
      next: (p) => {
        this.profile.set(p);
        this.ok.set('Perfil actualizado. Abrí la página pública para ver los cambios.');
        this.reload();
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo guardar el perfil')
    });
  }

  create() {
    this.error.set('');
    this.form.photos = this.photoUrl ? [this.photoUrl] : [];
    this.api.createVehicle(this.form).subscribe({
      next: () => {
        this.form.brand = '';
        this.form.model = '';
        this.form.price = 0;
        this.photoUrl = '';
        this.reload();
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo guardar')
    });
  }

  remove(id: string) {
    this.api.deleteVehicle(id).subscribe({
      next: () => this.reload(),
      error: (e) => this.error.set(e.error?.error || 'No se pudo borrar')
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/panel/login');
  }

  isSelf(user: PanelUser): boolean {
    return user.id === this.auth.session()?.userId;
  }
}
