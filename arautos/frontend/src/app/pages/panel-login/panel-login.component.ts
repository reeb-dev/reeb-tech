import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-panel-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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
      this.router.navigateByUrl('/panel');
    }
  }

  submit() {
    this.error.set('');
    this.message.set('');
    if (this.mode === 'login') {
      this.auth.login(this.email, this.password).subscribe({
        next: () => this.router.navigateByUrl('/panel'),
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
          this.message.set(res.message || 'Registro enviado. Esperá aprobación admin.');
        },
        error: (e) => this.error.set(e.error?.error || 'No se pudo registrar')
      });
    }
  }
}
