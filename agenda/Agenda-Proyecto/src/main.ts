import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ContactListComponent } from './app/contact-list/contact-list.component';

// Registra el ContactListComponent para que sea accesible
bootstrapApplication(AppComponent, {
  ...appConfig, // Mantén la configuración existente
  providers: [
    ...(appConfig.providers || []), // Asegúrate de incluir los providers anteriores si existen
    ContactListComponent // Incluye el ContactListComponent como parte de los imports
  ],
})
  .catch((err) => console.error(err));
