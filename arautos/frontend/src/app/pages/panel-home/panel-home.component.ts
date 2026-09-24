import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Stats, TenantProfile, VehiclePanel, VehicleRequest } from '../../core/models';
import { formatPrice, typeLabel } from '../../core/format';

@Component({
  selector: 'app-panel-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './panel-home.component.html',
  styleUrl: './panel-home.component.css'
})
export class PanelHomeComponent implements OnInit {
  vehicles = signal<VehiclePanel[]>([]);
  stats = signal<Stats | null>(null);
  profile = signal<TenantProfile | null>(null);
  error = signal('');
  formatPrice = formatPrice;
  typeLabel = typeLabel;

  form: VehicleRequest = {
    brand: '', model: '', version: '', year: new Date().getFullYear(), km: 0,
    type: 'USADO', price: 0, currency: 'USD', photos: [],
    province: '', city: '', fuel: 'nafta', transmission: 'manual', color: '',
    description: '', status: 'PUBLICADO'
  };

  constructor(private api: ApiService, public auth: AuthService, private router: Router) {
    if (!auth.session()) {
      this.router.navigateByUrl('/panel/login');
    }
  }

  ngOnInit() {
    if (!this.auth.session()) return;
    this.reload();
  }

  reload() {
    this.api.myVehicles().subscribe({ next: (v) => this.vehicles.set(v), error: (e) => this.error.set(e.error?.error || 'Error stock') });
    this.api.stats().subscribe({ next: (s) => this.stats.set(s) });
    this.api.profile().subscribe({
      next: (p) => {
        this.profile.set(p);
        this.form.province = p.province;
        this.form.city = p.city;
      }
    });
  }

  create() {
    this.error.set('');
    this.api.createVehicle(this.form).subscribe({
      next: () => {
        this.form.brand = '';
        this.form.model = '';
        this.form.price = 0;
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
}
