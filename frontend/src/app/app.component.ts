import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './components/tracking/tracking.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TrackingComponent],
  template:`
  <div class="app-container">
      <header>
        <h1>Seguimiento de Paquetes - ZOOM</h1>
      </header>
      <main>
        <app-tracking></app-tracking>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Zoom Tracker';
}
