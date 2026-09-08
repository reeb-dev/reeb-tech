import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../services/i18n';

@Component({
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class ContactComponent {
  readonly whatsappHref = 'https://wa.me/5492915757934';
  readonly mailTo = 'manuelreeb@icloud.com';

  name = '';
  email = '';
  message = '';
  submitted = false;
  touched = {
    name: false,
    email: false,
    message: false,
  };
  checked: Record<string, boolean> = {
    android: false,
    webapi: false,
    prod: false,
  };

  constructor(public i18n: I18nService) {}

  get nameError(): string | null {
    if (!this.submitted && !this.touched.name) {
      return null;
    }
    return this.name.trim() ? null : this.i18n.t().contact.requiredName;
  }

  get emailError(): string | null {
    if (!this.submitted && !this.touched.email) {
      return null;
    }
    const value = this.email.trim();
    return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? null
      : this.i18n.t().contact.invalidEmail;
  }

  get messageError(): string | null {
    if (!this.submitted && !this.touched.message) {
      return null;
    }
    return this.message.trim() ? null : this.i18n.t().contact.requiredMessage;
  }

  getMailtoLink(): string {
    const copy = this.i18n.t().contact;
    const selectedInterests = copy.interests
      .filter((i) => this.checked[i.id])
      .map((i) => i.label)
      .join(', ');

    const subject = encodeURIComponent(copy.mailSubject);
    const body = encodeURIComponent(
      `${copy.mailName}: ${this.name}\n` +
        `Email: ${this.email}\n` +
        `${copy.mailInterest}: ${selectedInterests || copy.mailUnspecified}\n\n` +
        `${copy.mailMessage}:\n${this.message}`
    );

    return `mailto:${this.mailTo}?subject=${subject}&body=${body}`;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted = true;
    this.touched = { name: true, email: true, message: true };
    if (this.nameError || this.emailError || this.messageError) {
      return;
    }
    window.location.href = this.getMailtoLink();
  }
}
