import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonIcon,
  IonCard,
  IonCardContent,
  IonInput,
  IonToggle,
  IonSpinner,
  IonButtons,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { ClienteService } from '../../services/cliente.service';
import { addIcons } from 'ionicons';
import { 
  close,
  create,
  personAdd,
  business,
  card,
  documentText,
  person,
  location,
  call,
  mail,
  power,
  checkmarkCircle,
  closeCircle,
  closeCircle as closeCircleIcon,
  save,
  addCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-cliente-modal',
  templateUrl: './cliente-modal.page.html',
  styleUrls: ['./cliente-modal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonInput,
    IonToggle,
    IonSpinner,
    IonButtons
  ]
})
export class ClienteModalPage implements OnInit {
  private clienteService = inject(ClienteService);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);

  isEdit: boolean = false;
  isLoading: boolean = false;
  clienteData: any = {
    tipo_cliente: '',
    tipo_documento: '',
    numero_documento: '',
    nombres: '',
    direccion: '',
    telefono: '',
    correo: '',
    estado: true
  };

  constructor() {
    addIcons({ 
      close,
      create,
      personAdd,
      business,
      card,
      documentText,
      person,
      location,
      call,
      mail,
      power,
      checkmarkCircle,
      closeCircle: closeCircleIcon,
      save,
      addCircle
    });
  }

  ngOnInit() {
    // Si estamos en modo edición, cargamos los datos del cliente
    if (this.isEdit && (this as any).cliente) {
      const cliente = (this as any).cliente;
      this.clienteData = {
        tipo_cliente: cliente.tipo_cliente || '',
        tipo_documento: cliente.tipo_documento || '',
        numero_documento: cliente.numero_documento || '',
        nombres: cliente.nombres || '',
        direccion: cliente.direccion || '',
        telefono: cliente.telefono || '',
        correo: cliente.correo || '',
        estado: cliente.estado === 1 || cliente.estado === true
      };
    }
  }

  async onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      let response: any;

      if (this.isEdit) {
        const clienteId = (this as any).cliente.id;
        response = await this.clienteService.updateCliente(clienteId, this.clienteData);
      } else {
        response = await this.clienteService.createCliente(this.clienteData);
      }

      if (response.status === 200 || response.status === 201) {
        this.showAlert('Éxito', this.isEdit ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente');
        this.dismiss(true);
      } else {
        this.showAlert('Error', response.message || 'Ha ocurrido un error');
      }
    } catch (error: any) {
      console.error('Error saving cliente:', error);
      this.showAlert('Error', error.error?.message || 'Error al guardar el cliente');
    } finally {
      this.isLoading = false;
    }
  }

  validateForm(): boolean {
    // Validar campos requeridos
    if (!this.clienteData.tipo_cliente || 
        !this.clienteData.tipo_documento || 
        !this.clienteData.numero_documento || 
        !this.clienteData.nombres || 
        !this.clienteData.direccion || 
        !this.clienteData.telefono || 
        !this.clienteData.correo) {
      this.showAlert('Error', 'Por favor completa todos los campos obligatorios');
      return false;
    }

    // Validar longitud del teléfono
    if (this.clienteData.telefono.length !== 9) {
      this.showAlert('Error', 'El teléfono debe tener exactamente 9 dígitos');
      return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.clienteData.correo)) {
      this.showAlert('Error', 'Por favor ingresa un correo electrónico válido');
      return false;
    }

    return true;
  }

  dismiss(refresh: boolean = false) {
    this.modalController.dismiss({ refresh });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}