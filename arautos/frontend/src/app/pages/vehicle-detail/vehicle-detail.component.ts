import { Component, HostListener, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { VehiclePublic } from '../../core/models';
import { formatPrice, typeLabel, waLink } from '../../core/format';

const FALLBACK_PHOTO = '/assets/cars/toyota-corolla.jpg';

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
  activeIndex = signal(0);
  lightboxOpen = signal(false);
  formatPrice = formatPrice;
  typeLabel = typeLabel;

  photos = computed(() => {
    const list = (this.vehicle()?.photos || []).filter((p) => !!p && p.trim());
    return list.length ? list : [FALLBACK_PHOTO];
  });

  activePhoto = computed(() => {
    const list = this.photos();
    const i = Math.min(Math.max(this.activeIndex(), 0), list.length - 1);
    return list[i] || FALLBACK_PHOTO;
  });

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.vehicle(id).subscribe({
      next: (v) => {
        this.vehicle.set(v);
        this.activeIndex.set(0);
        this.api.view(id).subscribe();
      },
      error: () => this.error.set('Aviso no disponible.')
    });
  }

  selectPhoto(index: number) {
    this.activeIndex.set(index);
  }

  openLightbox() {
    this.lightboxOpen.set(true);
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
  }

  prevPhoto(event: Event) {
    event.stopPropagation();
    const n = this.photos().length;
    if (n < 2) return;
    this.activeIndex.set((this.activeIndex() - 1 + n) % n);
  }

  nextPhoto(event: Event) {
    event.stopPropagation();
    const n = this.photos().length;
    if (n < 2) return;
    this.activeIndex.set((this.activeIndex() + 1) % n);
  }

  onImgError(event: Event) {
    const img = event.target as HTMLImageElement | null;
    if (img && img.src && !img.src.endsWith(FALLBACK_PHOTO)) {
      img.src = FALLBACK_PHOTO;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent) {
    if (!this.lightboxOpen()) return;
    if (event.key === 'Escape') this.closeLightbox();
    if (event.key === 'ArrowLeft') this.prevPhoto(event);
    if (event.key === 'ArrowRight') this.nextPhoto(event);
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
