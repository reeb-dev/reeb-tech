import { Component, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GeoArService } from './core/geo-ar.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  lemaMalvinas = signal('Las Malvinas son argentinas');

  constructor(private geo: GeoArService) {}

  ngOnInit() {
    this.geo.ensureLoaded().subscribe(() => {
      this.lemaMalvinas.set(this.geo.lemaMalvinas());
    });
  }
}
