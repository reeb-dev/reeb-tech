import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  title: string;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  tech: string[];
  demoUrl: string;
  codeUrl: string;
  image: string;
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
      title: 'Sistema CRM Enterprise',
      description: 'Plataforma completa de gestión de relaciones con clientes para empresa multinacional',
      problem: 'El cliente necesitaba gestionar 500+ ventas diarias sin control de inventario ni análisis de datos',
      solution: 'Desarrollé un sistema con Spring Boot, Angular y PostgreSQL bajo arquitectura limpia y principios SOLID',
      impact: 'Reducción del 40% en tiempo de respuesta y 60% en errores operacionales. Incremento de 30% en productividad',
      tech: ['Spring Boot', 'Angular', 'PostgreSQL', 'Docker', 'Kubernetes'],
      demoUrl: '#',
      codeUrl: '#',
      image: 'https://via.placeholder.com/600x400?text=CRM+Project'
    },
    {
      title: 'Plataforma de E-Learning',
      description: 'Aplicación web para educación online con más de 10,000 estudiantes activos',
      problem: 'Necesidad de escalabilidad, bajo rendimiento con muchos usuarios concurrentes',
      solution: 'Implementé arquitectura de microservicios con Redis para caché, implementé lazy loading y optimizaciones frontend',
      impact: 'Escalabilidad horizontal alcanzada, latencia reducida en 50%, incremento de usuarios a 50,000',
      tech: ['Next.js', 'Node.js', 'MongoDB', 'Redis', 'AWS'],
      demoUrl: '#',
      codeUrl: '#',
      image: 'https://via.placeholder.com/600x400?text=E-Learning'
    },
    {
      title: 'Dashboard Analytics en Tiempo Real',
      description: 'Sistema de visualización de datos en tiempo real para empresa financiera',
      problem: 'Necesidad de procesar y visualizar millones de transacciones diarias en tiempo real',
      solution: 'Utilicé WebSockets, InfluxDB para series temporales, Grafana y visualizaciones con D3.js',
      impact: 'Procesamiento en tiempo real de 1M+ eventos/minuto, latencia < 100ms, insights en 5 segundos',
      tech: ['React', 'WebSockets', 'InfluxDB', 'Grafana', 'Docker', 'Kafka'],
      demoUrl: '#',
      codeUrl: '#',
      image: 'https://via.placeholder.com/600x400?text=Analytics'
    }
  ];
}
