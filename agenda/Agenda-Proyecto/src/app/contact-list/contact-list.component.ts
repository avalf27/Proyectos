import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  imports: [QRCodeComponent,CommonModule, FormsModule],
})
export class ContactListComponent {
  // Lista de contactos
  contacts = [
    { name: 'Juan Pérez', phone: '123456789', group: 'Familia' },
    { name: 'Ana Gómez', phone: '987654321', group: 'Trabajo' },
    { name: 'Carlos García', phone: '555444333', group: 'Amigos' }
  ];

  // Lista de grupos
  groups = ['Familia', 'Amigos', 'Trabajo'];

  // Contacto actual (para añadir o editar)
  contact = { name: '', phone: '', group: '' };

  // Variable para agregar un nuevo grupo
  newGroup = '';

  // Estado de búsqueda y grupo seleccionado
  searchTerm: string = '';
  selectedGroup: string = '';

  // Variables para edición
  isEditing = false;
  editingIndex: number | null = null;

  // Mensajes de error separados para cada sección
  contactErrorMessage: string = ''; // Mensaje de error para contacto
  groupErrorMessage: string = ''; // Mensaje de error para grupo

  // Referencias al div del mensaje de error
  @ViewChild('contactErrorDiv') contactErrorDiv!: ElementRef;
  @ViewChild('groupErrorDiv') groupErrorDiv!: ElementRef;

   // Variables de contactos, grupos, etc...
   qrData: string | null = null;

  // Método para generar el QR
    generateQRCode(contact: { name: string; phone: string; group: string }) {
    this.qrData = `Nombre: ${contact.name}\nTeléfono: ${contact.phone}\nGrupo: ${contact.group}`;
    }

  // Método para cerrar el QR
    closeQRCode() {
      this.qrData = null;
    }

  // Añadir o actualizar contacto
  addOrUpdateContact() {
    this.contactErrorMessage = '';
  
    // Validar que se haya seleccionado un grupo
    if (!this.contact.group || this.contact.group === '') {
      this.contactErrorMessage = 'Debes seleccionar un grupo para el contacto.';
      this.scrollToError(this.contactErrorDiv);
      return;
    }
  
    // Validar duplicados, ignorando el contacto que se está editando actualmente
    const isDuplicateName = this.contacts.some((c, index) => {
      return (
        c.name.toLowerCase() === this.contact.name.toLowerCase() &&
        index !== this.editingIndex
      );
    });
  
    const isDuplicatePhone = this.contacts.some((c, index) => {
      return (
        c.phone === this.contact.phone &&
        index !== this.editingIndex
      );
    });
  
    if (isDuplicateName) {
      this.contactErrorMessage = 'Ya existe un contacto con el mismo nombre.';
      this.scrollToError(this.contactErrorDiv);
      return;
    }
  
    if (isDuplicatePhone) {
      this.contactErrorMessage = 'Ya existe un contacto con el mismo número de teléfono.';
      this.scrollToError(this.contactErrorDiv);
      return;
    }
  
    if (this.isEditing) {
      // Editar contacto, actualizando el contacto en su índice correspondiente
      this.contacts[this.editingIndex!] = { ...this.contact };
      this.isEditing = false;
    } else {
      // Añadir nuevo contacto
      this.contacts.push({ ...this.contact });
    }
  
    this.resetForm();
  }
  
  

  // Editar contacto
  editContact(index: number) {
    this.isEditing = true;
    this.editingIndex = index;
    this.contact = { ...this.contacts[index] };
  }

  // Eliminar contacto
  deleteContact(index: number) {
    this.contacts.splice(index, 1);
  }

  // Añadir grupo
  addGroup() {
    this.groupErrorMessage = '';

    // Validar que el campo de grupo no esté vacío
    if (!this.newGroup.trim()) {
      this.groupErrorMessage = 'El nombre del grupo no puede estar vacío.';
      this.scrollToError(this.groupErrorDiv);
      return;
    }

    // Validar si el grupo ya existe (insensible a mayúsculas y minúsculas)
    const groupExists = this.groups.some(
      (group) => group.toLowerCase() === this.newGroup.trim().toLowerCase()
    );

    if (groupExists) {
      this.groupErrorMessage = 'El grupo ya existe.';
      this.scrollToError(this.groupErrorDiv);
      return;
    }

    // Añadir grupo si no existe
    this.groups.push(this.newGroup.trim());
    this.newGroup = ''; // Limpiar el campo de entrada
    this.groupErrorMessage = ''; // Limpiar mensaje de error
  }


  // Filtrar contactos por grupo y búsqueda
  get filteredContacts() {
    let filtered = this.contacts;

    // Filtrar por grupo seleccionado, si se seleccionó uno
    if (this.selectedGroup) {
      filtered = filtered.filter(contact => contact.group === this.selectedGroup);
    }

    // Filtrar por el término de búsqueda, si se ingresó uno
    if (this.searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          contact.phone.includes(this.searchTerm)
      );
    }

    return filtered;
  }

  // Obtener contactos agrupados por grupo considerando los filtros
  get groupedContacts() {
    const grouped = this.groups.map((group) => ({
      group,
      contacts: this.filteredContacts.filter((contact) => contact.group === group),
    }));

    // Filtrar solo los grupos que tienen contactos coincidentes
    return grouped.filter((group) => group.contacts.length > 0);
  }

  // Resetear formulario
  resetForm() {
    this.contact = { name: '', phone: '', group: '' };
    this.isEditing = false;
    this.editingIndex = null;
    this.contactErrorMessage = '';
  }

  // Método para hacer scroll al mensaje de error
  scrollToError(errorDiv: ElementRef) {
    if (errorDiv) {
      errorDiv.nativeElement.scrollIntoView({
        behavior: 'smooth', // Desplazamiento suave
        block: 'center', // Centra el mensaje en la pantalla
      });
    }
  }
}
