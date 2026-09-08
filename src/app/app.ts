import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { CompaniesComponent } from './components/companies/companies';
import { ProjectsComponent } from './components/projects/projects';
import { StackComponent } from './components/stack/stack';
import { CertificatesComponent } from './components/certificates/certificates';
import { AboutComponent } from './components/about/about';
import { DemosComponent } from './components/demos/demos';
import { ServicesComponent } from './components/services/services';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';
import { I18nService } from './services/i18n';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    CompaniesComponent,
    ProjectsComponent,
    StackComponent,
    CertificatesComponent,
    AboutComponent,
    DemosComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  constructor(_i18n: I18nService) {}
}
