import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
  RankingResponse,
  MetaStatus,
  MetaPageOption,
  PublishPreview,
  PublicationResult
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
  meta = signal<MetaStatus | null>(null);
  metaPages = signal<MetaPageOption[]>([]);
  preview = signal<PublishPreview | null>(null);
  publications = signal<PublicationResult[]>([]);
  error = signal('');
  ok = signal('');
  formatPrice = formatPrice;
  typeLabel = typeLabel;
  photoUrl = '';
  checkoutBusy = false;
  metaBusy = false;
  publishBusy = false;
  selectedVehicleId = '';
  publishFacebook = true;
  publishInstagram = true;

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

  constructor(
    private api: ApiService,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.reload();
    const meta = this.route.snapshot.queryParamMap.get('meta');
    if (meta === 'select' || meta === 'connected') {
      this.loadMeta(true);
    }
    if (this.route.snapshot.queryParamMap.get('oauth_error')) {
      this.error.set('No se pudo completar la conexión con Meta. Intente de nuevo.');
    }
  }

  reload() {
    this.api.myVehicles().subscribe({ next: (v) => this.vehicles.set(v), error: (e) => this.error.set(e.error?.error || 'Error stock') });
    this.api.stats().subscribe({ next: (s) => this.stats.set(s) });
    this.api.billingStatus().subscribe({ next: (b) => this.billing.set(b) });
    this.api.ranking().subscribe({ next: (r) => this.ranking.set(r), error: () => this.ranking.set(null) });
    this.loadMeta(false);
    this.api.socialPublications().subscribe({ next: (p) => this.publications.set(p), error: () => this.publications.set([]) });
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

  loadMeta(loadPages: boolean) {
    this.api.metaStatus().subscribe({
      next: (m) => {
        this.meta.set(m);
        if (loadPages || m.pendingPageSelection) {
          this.api.metaPages().subscribe({
            next: (res) => this.metaPages.set(res.pages),
            error: () => this.metaPages.set([])
          });
        }
      },
      error: () => this.meta.set(null)
    });
  }

  connectMeta() {
    this.error.set('');
    this.metaBusy = true;
    this.api.metaStart().subscribe({
      next: (res) => {
        this.metaBusy = false;
        if (res.authorizeUrl) {
          window.location.href = res.authorizeUrl;
          return;
        }
        this.error.set(res.message || 'No se pudo iniciar Conectar Meta');
      },
      error: (e) => {
        this.metaBusy = false;
        this.error.set(e.error?.error || 'Meta no disponible');
      }
    });
  }

  selectMetaPage(pageId: string) {
    this.error.set('');
    this.ok.set('');
    this.api.metaSelectPage(pageId).subscribe({
      next: (m) => {
        this.meta.set(m);
        this.metaPages.set([]);
        this.ok.set(m.message);
        this.router.navigate([], { queryParams: { meta: 'connected' }, queryParamsHandling: 'merge' });
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo seleccionar la Página')
    });
  }

  disconnectMeta() {
    if (!confirm('¿Desconectar Facebook e Instagram de esta concesionaria? Se borrarán los tokens guardados.')) {
      return;
    }
    this.api.metaDisconnect().subscribe({
      next: (m) => {
        this.meta.set(m);
        this.ok.set('Redes desconectadas.');
      },
      error: (e) => this.error.set(e.error?.error || 'No se pudo desconectar')
    });
  }

  loadPreview() {
    this.error.set('');
    this.preview.set(null);
    if (!this.selectedVehicleId) {
      this.error.set('Elija un vehículo');
      return;
    }
    this.api.publishPreview(this.selectedVehicleId).subscribe({
      next: (p) => this.preview.set(p),
      error: (e) => this.error.set(e.error?.error || 'No se pudo generar la vista previa')
    });
  }

  confirmPublish() {
    this.error.set('');
    this.ok.set('');
    if (!this.selectedVehicleId) {
      this.error.set('Elija un vehículo');
      return;
    }
    this.publishBusy = true;
    this.api.publishSocial({
      vehicleId: this.selectedVehicleId,
      facebook: this.publishFacebook,
      instagram: this.publishInstagram
    }).subscribe({
      next: (res) => {
        this.publishBusy = false;
        this.ok.set(res.message);
        this.publications.set([...res.results, ...this.publications()]);
      },
      error: (e) => {
        this.publishBusy = false;
        this.error.set(e.error?.error || 'No se pudo publicar');
      }
    });
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
