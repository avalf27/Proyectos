import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ContactListComponent {
  // Lista de contactos
  contacts = [
    { name: 'Juan Pérez', phone: '123456789', group: 'Familia' },
    { name: 'Ana Gómez', phone: '987654321', group: 'Trabajo' },
  ];

  // Lista de grupos
  groups = ['Familia', 'Amigos', 'Trabajo'];

  // Contacto actual (para añadir o editar)
  contact = { name: '', phone: '', group: '' };

  // Variable para agregar un nuevo grupo
  newGroup = '';

  // Estado de búsqueda
  searchTerm: string = '';

  // Variables para edición
  isEditing = false;
  editingIndex: number | null = null;

  // Mensajes de error separados para cada sección
  contactErrorMessage: string = ''; // Mensaje de error para contacto
  groupErrorMessage: string = ''; // Mensaje de error para grupo

  // Referencias al div del mensaje de error
  @ViewChild('contactErrorDiv') contactErrorDiv!: ElementRef;
  @ViewChild('groupErrorDiv') groupErrorDiv!: ElementRef;

  // Añadir contacto
  addContact() {
    this.contactErrorMessage = '';

    // Validar que se haya seleccionado un grupo
    if (!this.contact.group || this.contact.group === '') {
      this.contactErrorMessage = 'Debes seleccionar un grupo para el contacto.';
      this.scrollToError(this.contactErrorDiv);
      return;
    }

    // Validar duplicados
    const duplicate = this.contacts.some(
      (c, index) =>
        (c.name.toLowerCase() === this.contact.name.toLowerCase() ||
          c.phone === this.contact.phone) &&
        index !== this.editingIndex
    );

    if (duplicate) {
      this.contactErrorMessage = 'Ya existe un contacto con el mismo nombre o número de teléfono.';
      this.scrollToError(this.contactErrorDiv);
      return;
    }

    if (this.isEditing) {
      // Editar contacto
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

  // Filtrar contactos por búsqueda
  get filteredContacts() {
    return this.contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.phone.includes(this.searchTerm)
    );
  }

  // Agrupar contactos por grupo
  get groupedContacts() {
    const grouped = this.groups.map((group) => ({
      group,
      contacts: this.contacts.filter((contact) => contact.group === group),
    }));

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
