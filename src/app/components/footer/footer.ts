import { Component } from '@angular/core';
import { LogoComponent } from '../logo/logo';

@Component({
  selector: 'app-footer',
  imports: [LogoComponent],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
