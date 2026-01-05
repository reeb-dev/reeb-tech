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
      name: 'Frontend',
      icon: '🎨',
      technologies: ['Angular (Especialidad)', 'TypeScript', 'Tailwind CSS', 'RxJS']
    },
    {
      name: 'Backend',
      icon: '⚙️',
      technologies: ['Java / Spring Boot', 'Node.js', 'PostgreSQL', 'MySQL', 'Oracle']
    },
    {
      name: 'Mobile',
      icon: '📱',
      technologies: ['Android Nativo', 'Kotlin', 'Jetpack Compose']
    },
    {
      name: 'Infra',
      icon: '🛠️',
      technologies: ['Docker', 'CI/CD', 'Git', 'Linux']
    }
  ];
}
