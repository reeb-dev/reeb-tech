import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Company {
  name: string;
  logo?: string;
  years: string;
  description?: string;
  initials?: string;
  color?: string;
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
      initials: 'IN',
      color: 'bg-blue-500',
      years: '2020 - 2024',
      description: 'Multinacional Fortune 500. Lideré proyectos empresariales con millones de usuarios.'
    },
    {
      name: 'SisKit',
      initials: 'SK',
      color: 'bg-purple-500',
      years: '2018 - 2020',
      description: 'Startup de software. Arquitectura y desarrollo de plataforma core.'
    }
  ];
}
