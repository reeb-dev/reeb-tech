import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { CompaniesComponent } from './components/companies/companies';
import { ProjectsComponent } from './components/projects/projects';
import { StackComponent } from './components/stack/stack';
import { AboutComponent } from './components/about/about';
import { ServicesComponent } from './components/services/services';
import { ContactComponent } from './components/contact/contact';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    HeroComponent,
    CompaniesComponent,
    ProjectsComponent,
    StackComponent,
    AboutComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {}
