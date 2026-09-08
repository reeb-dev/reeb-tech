import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../services/i18n';

@Component({
  selector: 'app-demos',
  imports: [CommonModule],
  templateUrl: './demos.html',
})
export class DemosComponent {
  constructor(public i18n: I18nService) {}

  demoHref(id: string): string {
    return `${this.i18n.t().demos.hubUrl}${id}/`;
  }
}
