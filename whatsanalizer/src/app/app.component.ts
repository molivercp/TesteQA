import { Component } from '@angular/core';
import { WhatsanalizerComponent } from './whatsanalizer/whatsanalizer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WhatsanalizerComponent],
  template: '<app-whatsanalizer></app-whatsanalizer>',
})
export class AppComponent {
  title = 'whatsanalizer';
}