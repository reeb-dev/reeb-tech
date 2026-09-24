import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { VehiclePublic } from '../../core/models';
import { formatPrice, typeLabel } from '../../core/format';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  vehicles = signal<VehiclePublic[]>([]);
  error = signal('');
  brand = '';
  province = '';
  type = '';
  currency = '';
  formatPrice = formatPrice;
  typeLabel = typeLabel;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.error.set('');
    this.api.catalog({
      brand: this.brand || undefined,
      province: this.province || undefined,
      type: this.type || undefined,
      currency: this.currency || undefined
    }).subscribe({
      next: (list) => this.vehicles.set(list),
      error: () => this.error.set('No se pudo cargar el catálogo.')
    });
  }
}
