import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { VehiclePublic } from '../../core/models';
import { formatPrice, typeLabel, waLink } from '../../core/format';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent implements OnInit {
  vehicle = signal<VehiclePublic | null>(null);
  error = signal('');
  formatPrice = formatPrice;
  typeLabel = typeLabel;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.vehicle(id).subscribe({
      next: (v) => {
        this.vehicle.set(v);
        this.api.view(id).subscribe();
      },
      error: () => this.error.set('Aviso no disponible.')
    });
  }

  contactWa() {
    const v = this.vehicle();
    if (!v) return;
    this.api.waClick(v.id).subscribe({
      next: () => {
        const msg = `Hola, vi el ${v.brand} ${v.model} ${v.year} en ArAutos y me interesa.`;
        window.open(waLink(v.dealerWhatsapp, msg), '_blank');
      }
    });
  }
}
