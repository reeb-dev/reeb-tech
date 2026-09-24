import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, tap } from 'rxjs';

export interface ProvinciaAr {
  id: string;
  nombre: string;
}

export interface MalvinasMeta {
  lema: string;
  provinciaId: string;
  provinciaNombre: string;
  localidadesDestacadas: string[];
}

interface GeoPayload {
  fuente: string;
  descripcion: string;
  provincias: ProvinciaAr[];
  porProvincia: Record<string, string[]>;
  malvinas?: MalvinasMeta;
}

@Injectable({ providedIn: 'root' })
export class GeoArService {
  private loaded = signal(false);
  private provinciasList: ProvinciaAr[] = [];
  private porProvincia: Record<string, string[]> = {};
  private idByNombre = new Map<string, string>();
  private malvinasMeta: MalvinasMeta | null = null;
  private readonly data$: Observable<GeoPayload>;

  constructor(private readonly http: HttpClient) {
    this.data$ = this.http.get<GeoPayload>('/assets/geo/ar-provincias-localidades.json').pipe(
      tap((payload) => {
        this.provinciasList = payload.provincias;
        this.porProvincia = payload.porProvincia;
        this.idByNombre = new Map(
          payload.provincias.map((p) => [p.nombre.toLocaleLowerCase('es-AR'), p.id])
        );
        this.malvinasMeta = payload.malvinas ?? {
          lema: 'Las Malvinas son argentinas',
          provinciaId: '',
          provinciaNombre: 'Tierra del Fuego, Antártida e Islas del Atlántico Sur',
          localidadesDestacadas: ['Islas Malvinas', 'Puerto Argentino']
        };
        this.loaded.set(true);
      }),
      shareReplay(1)
    );
  }

  ensureLoaded(): Observable<boolean> {
    return this.data$.pipe(map(() => true));
  }

  provincias(): ProvinciaAr[] {
    return this.provinciasList;
  }

  localidades(provinceName: string): string[] {
    if (!provinceName) return [];
    const id = this.idByNombre.get(provinceName.toLocaleLowerCase('es-AR'));
    if (!id) return [];
    return this.porProvincia[id] || [];
  }

  malvinas(): MalvinasMeta | null {
    return this.malvinasMeta;
  }

  lemaMalvinas(): string {
    return this.malvinasMeta?.lema ?? 'Las Malvinas son argentinas';
  }

  isReady(): boolean {
    return this.loaded();
  }
}
