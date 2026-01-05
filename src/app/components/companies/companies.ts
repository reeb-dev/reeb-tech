import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Company {
  name: string;
  logo: string;
  years: string;
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
      logo: 'https://via.placeholder.com/120x60?text=Indra',
      years: '2020 - 2024'
    },
    {
      name: 'Tech Company',
      logo: 'https://via.placeholder.com/120x60?text=Tech+Co',
      years: '2018 - 2020'
    },
    {
      name: 'Startup Local',
      logo: 'https://via.placeholder.com/120x60?text=Startup',
      years: '2016 - 2018'
    }
  ];
}
