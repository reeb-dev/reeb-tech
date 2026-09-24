import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { GeoSelectComponent } from '../../shared/geo-select.component';

@Component({
  selector: 'app-panel-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, GeoSelectComponent],
  templateUrl: './panel-login.component.html',
  styleUrl: './panel-login.component.css'
})
export class PanelLoginComponent {
  mode: 'login' | 'register' = 'login';
  email = 'demo1@patagonia-motors.example';
  password = 'demo123';
  dealerName = '';
  province = '';
  city = '';
  whatsapp = '';
  message = signal('');
  error = signal('');

  constructor(private auth: AuthService, private router: Router) {
    if (auth.session()) {
      this.router.navigateByUrl(auth.homePath());
    }
  }

  useSeed(kind: 'demo' | 'agent' | 'admin') {
    if (kind === 'demo') {
      this.email = 'demo1@patagonia-motors.example';
      this.password = 'demo123';
    } else if (kind === 'agent') {
      this.email = 'agente1@patagonia-motors.example';
      this.password = 'demo123';
    } else {
      this.email = 'admin@arautos.local';
      this.password = 'admin123';
    }
    this.mode = 'login';
  }

  submit() {
    this.error.set('');
    this.message.set('');
    if (this.mode === 'login') {
      this.auth.login(this.email, this.password).subscribe({
        next: () => this.router.navigateByUrl(this.auth.homePath()),
        error: (e) => this.error.set(e.error?.error || 'No se pudo iniciar sesión')
      });
    } else {
      this.auth.register({
        email: this.email,
        password: this.password,
        dealerName: this.dealerName,
        province: this.province,
        city: this.city,
        whatsapp: this.whatsapp
      }).subscribe({
        next: (res) => {
          this.message.set(res.message || 'Registro enviado. Un administrador debe aprobar su cuenta.');
        },
        error: (e) => this.error.set(e.error?.error || 'No se pudo registrar')
      });
    }
  }
}
