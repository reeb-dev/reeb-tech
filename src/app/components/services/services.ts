import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  title: string;
  description: string;
  icon: string;
  features: string[];
}

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class ServicesComponent {
  services: Service[] = [
    {
      title: 'Desarrollo de Software a Medida',
      description: 'Desarrollo de aplicaciones personalizadas adaptadas a tus necesidades empresariales específicas.',
      icon: '💻',
      features: [
        'Aplicaciones Web (Angular, React, Vue)',
        'Aplicaciones Backend (Spring Boot, Node.js)',
        'Integración de APIs y servicios',
        'Bases de datos y optimización'
      ]
    },
    {
      title: 'Modernización de Aplicaciones',
      description: 'Actualización de sistemas legacy a tecnologías modernas, mejorando rendimiento y mantenibilidad.',
      icon: '🚀',
      features: [
        'Migración a arquitecturas modernas',
        'Containerización con Docker',
        'Implementación de CI/CD',
        'Mejora de rendimiento y escalabilidad'
      ]
    },
    {
      title: 'Consultoría Técnica y Arquitectura',
      description: 'Asesoramiento experto en decisiones arquitectónicas y mejores prácticas de desarrollo.',
      icon: '🏗️',
      features: [
        'Diseño de arquitecturas escalables',
        'Code Reviews y Best Practices',
        'Mentoring técnico a equipos',
        'Planificación de proyectos complejos'
      ]
    }
  ];
}
