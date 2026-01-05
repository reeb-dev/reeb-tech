import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface InterestOption {
  id: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';
  
  interests: InterestOption[] = [
    { id: 'mvp', label: 'Necesito una solución desde cero (MVP)', checked: false },
    { id: 'support', label: 'Busco soporte para un sistema existente', checked: false },
    { id: 'hire', label: 'Quiero hablar sobre una vacante Senior/Staff', checked: false }
  ];

  getMailtoLink(): string {
    const selectedInterests = this.interests
      .filter(i => i.checked)
      .map(i => i.label)
      .join(', ');
    
    const subject = encodeURIComponent('Consulta técnica desde REEB');
    const body = encodeURIComponent(
      `Nombre: ${this.name}\n` +
      `Email: ${this.email}\n` +
      `Interés: ${selectedInterests || 'No especificado'}\n\n` +
      `Mensaje:\n${this.message}`
    );
    
    return `mailto:manuelreeb@icloud.com?subject=${subject}&body=${body}`;
  }
}
