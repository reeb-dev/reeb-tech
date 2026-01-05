import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Company {
  name: string;
  logo: string;
  years: string;
  description?: string;
}

@Component({
  selector: 'app-companies',
  imports: [CommonModule],
  templateUrl: './companies.html',
  styleUrl: './companies.css',
})
export class CompaniesComponent {
  companies: Company[] = [
    {
      name: 'Indra',
      logo: 'screenshot-2025-02-05-130401.png',
      years: '2020 - 2024',
      description: 'Multinacional Fortune 500. Lideré proyectos empresariales con millones de usuarios.'
    },
    {
      name: 'SisKit',
      logo: 'unnamed.webp',
      years: '2018 - 2020',
      description: 'Startup de software. Arquitectura y desarrollo de plataforma core.'
    }
  ];
}
