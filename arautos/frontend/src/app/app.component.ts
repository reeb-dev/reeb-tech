import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeoArService } from './core/geo-ar.service';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  lemaMalvinas = signal('Las Malvinas son argentinas');

  constructor(private geo: GeoArService, public auth: AuthService) {}

  ngOnInit() {
    this.geo.ensureLoaded().subscribe(() => {
      this.lemaMalvinas.set(this.geo.lemaMalvinas());
    });
  }

  panelLink(): string {
    if (!this.auth.isLoggedIn()) return '/panel/login';
    return this.auth.homePath();
  }

  panelLabel(): string {
    if (this.auth.isPlatformAdmin()) return 'Administración';
    if (this.auth.isLoggedIn()) return 'Mi panel';
    return 'Mi concesionaria';
  }
}
