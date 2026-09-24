import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { DealerPublic } from '../../core/models';
import { formatPrice, typeLabel, waLink } from '../../core/format';

@Component({
  selector: 'app-dealer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dealer-profile.component.html',
  styleUrl: './dealer-profile.component.css'
})
export class DealerProfileComponent implements OnInit {
  dealer = signal<DealerPublic | null>(null);
  error = signal('');
  formatPrice = formatPrice;
  typeLabel = typeLabel;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.dealer(slug).subscribe({
      next: (d) => this.dealer.set(d),
      error: () => this.error.set('Perfil no disponible (suscripción vencida u oculta).')
    });
  }

  wa(dealer: DealerPublic) {
    window.open(waLink(dealer.whatsapp, `Hola ${dealer.name}, vi su perfil en ArAutos.`), '_blank');
  }
}
