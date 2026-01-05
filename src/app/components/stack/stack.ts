import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TechCategory {
  name: string;
  icon: string;
  technologies: string[];
}

@Component({
  selector: 'app-stack',
  imports: [CommonModule],
  templateUrl: './stack.html',
  styleUrl: './stack.css',
})
export class StackComponent {
  techStack: TechCategory[] = [
    {
      name: 'Backend',
      icon: '⚙️',
      technologies: ['Java/Spring Boot', 'Node.js/Express', 'Python/FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes']
    },
    {
      name: 'Frontend',
      icon: '🎨',
      technologies: ['Angular', 'React', 'TypeScript', 'Tailwind CSS', 'RxJS', 'State Management', 'Testing Angular']
    },
    {
      name: 'DevOps & Cloud',
      icon: '☁️',
      technologies: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub Actions', 'Jenkins', 'Terraform', 'Linux']
    },
    {
      name: 'Herramientas & Metodologías',
      icon: '🛠️',
      technologies: ['Git', 'Agile/Scrum', 'Clean Code', 'SOLID Principles', 'Microservicios', 'REST APIs', 'GraphQL', 'Testing']
    }
  ];
}
