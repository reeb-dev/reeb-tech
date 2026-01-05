import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
  title: string;
  problem: string;
  solution: string;
  icon: string;
  features: string[];
}

interface UseCase {
  problem: string;
  cta: string;
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
      title: 'Recuperación de Proyectos',
      problem: '¿Tienes código que nadie entiende o que se rompe constantemente?',
      solution: 'Analizo la deuda técnica y estabilizo el sistema para que puedas seguir creciendo.',
      icon: '🔧',
      features: [
        'Auditoría de código existente',
        'Refactoring sin romper nada',
        'Documentación técnica',
        'Estabilización de bugs críticos'
      ]
    },
    {
      title: 'Desarrollo de MVPs',
      problem: '¿Tienes una idea pero no sabes cómo empezar sin gastar de más?',
      solution: 'Construyo productos mínimos viables bajo estándares profesionales, evitando errores de base.',
      icon: '🚀',
      features: [
        'De la idea al código funcional',
        'Stack adecuado (no oversized)',
        'Arquitectura escalable desde el día 1',
        'Entrega iterativa y feedback rápido'
      ]
    },
    {
      title: 'Consultoría de Arquitectura',
      problem: '¿No sabes si elegir Angular, React, Spring o Node?',
      solution: 'Te ayudo a elegir el stack correcto para que no gastes de más en infraestructura innecesaria.',
      icon: '📐',
      features: [
        'Evaluación de requerimientos reales',
        'Propuesta de arquitectura',
        'Estimación de costos realista',
        'Roadmap técnico claro'
      ]
    }
  ];

  useCases: UseCase[] = [
    { problem: 'Tu app Angular está lenta o llena de errores que nadie sabe arreglar', cta: 'Yo la estabilizo' },
    { problem: 'Quieres migrar tu base de datos y te da miedo perder información', cta: 'Hablemos' },
    { problem: 'Necesitas un experto en Spring/Java para una urgencia', cta: 'Contáctame' },
    { problem: 'Tu equipo interno no da abasto y necesitas refuerzo temporal', cta: 'Staff augmentation' }
  ];

  advantages = [
    {
      title: 'Comunicación Directa',
      description: 'Hablo en humano, no solo en código. Te explico qué estamos haciendo y por qué.'
    },
    {
      title: 'Autonomía Total',
      description: 'Después de 4 años en Indra, sé trabajar sin supervisión constante. Me das un problema y te traigo la solución.'
    },
    {
      title: 'Código con Propiedad',
      description: 'Todo lo que construyo es tuyo. Código documentado y listo para que cualquier otro desarrollador pueda seguir.'
    }
  ];
}
