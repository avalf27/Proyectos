import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ContactListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'Agenda-contactos';
}
