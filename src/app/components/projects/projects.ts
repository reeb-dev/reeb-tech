import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  context: string;
  role: string;
  environment: string;
  challenge: string;
  solution: string;
  metrics: string;
  tech: string[];
}

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class ProjectsComponent {
  projects: Project[] = [
    {
      title: 'Sistemas Críticos — Indra',
      context: 'Entorno enterprise con aplicaciones de alto flujo de datos y usuarios.',
      role: 'Software Engineer',
      environment: 'Enterprise / Soporte Nivel 3',
      challenge: 'Mantener la operatividad de aplicaciones que no podían permitirse caídas.',
      solution: 'Refactorización de módulos legados, optimización de consultas SQL y mantenimiento de despliegues en entornos de producción.',
      metrics: 'Uptime: 99.9%',
      tech: ['Java', 'Spring', 'Oracle SQL', 'Angular']
    },
    {
      title: 'Arquitectura de Microservicios',
      context: 'Migración de monolito a servicios independientes.',
      role: 'Backend Developer',
      environment: 'Startup / Greenfield',
      challenge: 'Migrar funcionalidades sin interrumpir el servicio ni perder integridad de datos.',
      solution: 'Implementación de APIs REST robustas y comunicación entre servicios asegurando consistencia transaccional.',
      metrics: 'Zero downtime migration',
      tech: ['Spring Boot', 'Node.js', 'Docker', 'PostgreSQL']
    }
  ];
}
