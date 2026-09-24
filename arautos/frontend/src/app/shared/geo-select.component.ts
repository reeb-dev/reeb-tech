import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeoArService, ProvinciaAr } from '../core/geo-ar.service';

@Component({
  selector: 'app-geo-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="field">
      <label>{{ provinceLabel }}</label>
      <select
        [ngModel]="province"
        (ngModelChange)="onProvince($event)"
        [name]="namePrefix + 'province'"
        [required]="required"
        [disabled]="disabled || !ready">
        <option *ngIf="allowEmptyProvince" value="">{{ emptyProvinceLabel }}</option>
        @for (p of provincias; track p.id) {
          <option [value]="p.nombre">{{ p.nombre }}</option>
        }
      </select>
    </div>
    <div class="field" *ngIf="showLocality">
      <label>{{ localityLabel }}</label>
      <select
        [ngModel]="locality"
        (ngModelChange)="onLocality($event)"
        [name]="namePrefix + 'locality'"
        [required]="required && !!province"
        [disabled]="disabled || !ready || !province">
        <option *ngIf="allowEmptyLocality" value="">{{ emptyLocalityLabel }}</option>
        @for (loc of localities; track loc) {
          <option [value]="loc">{{ loc }}</option>
        }
      </select>
    </div>
  `
})
export class GeoSelectComponent implements OnInit, OnChanges {
  private readonly geo = inject(GeoArService);

  @Input() province = '';
  @Input() locality = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() showLocality = true;
  @Input() allowEmptyProvince = false;
  @Input() allowEmptyLocality = false;
  @Input() emptyProvinceLabel = 'Todas';
  @Input() emptyLocalityLabel = 'Todas';
  @Input() provinceLabel = 'Provincia';
  @Input() localityLabel = 'Localidad';
  @Input() namePrefix = 'geo';
  @Output() provinceChange = new EventEmitter<string>();
  @Output() localityChange = new EventEmitter<string>();

  provincias: ProvinciaAr[] = [];
  localities: string[] = [];
  ready = false;

  ngOnInit() {
    this.geo.ensureLoaded().subscribe(() => {
      this.provincias = this.geo.provincias();
      this.ready = true;
      this.refreshLocalities(false);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['province'] || changes['locality']) {
      if (this.ready) this.refreshLocalities(false);
    }
  }

  onProvince(value: string) {
    this.province = value;
    this.provinceChange.emit(value);
    this.refreshLocalities(true);
  }

  onLocality(value: string) {
    this.locality = value;
    this.localityChange.emit(value);
  }

  private refreshLocalities(clearIfMissing: boolean) {
    this.localities = this.geo.localidades(this.province);
    if (!this.province) {
      if (clearIfMissing || this.locality) {
        this.locality = '';
        this.localityChange.emit('');
      }
      return;
    }
    if (this.locality && !this.localities.includes(this.locality)) {
      if (clearIfMissing) {
        this.locality = '';
        this.localityChange.emit('');
      } else {
        this.localities = [this.locality, ...this.localities];
      }
    }
  }
}
