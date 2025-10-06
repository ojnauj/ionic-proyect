import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonButton, 
  IonIcon,
  IonSpinner,
  IonButtons,
  AlertController,
  ModalController
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { ClienteModalPage } from '../../modals/cliente-modal/cliente-modal.page';
import { addIcons } from 'ionicons';
import { 
  logOut, 
  arrowBack,
  add,
  people,
  refresh,
  business,
  time,
  addCircle,
  list,
  create,
  trash,
  call,
  mail,
  location,
  peopleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSpinner,
    IonButtons
  ]
})
export class ClientesPage implements OnInit {
  private authService = inject(AuthService);
  private clienteService = inject(ClienteService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);

  clientes: any[] = [];
  isLoading: boolean = false;
  currentDate: string = '';

  constructor() {
    // Agregar todos los iconos necesarios
    addIcons({ 
      logOut, 
      arrowBack,
      add,
      people,
      refresh,
      business,
      time,
      addCircle,
      list,
      create,
      trash,
      call,
      mail,
      location,
      peopleOutline
    });
  }

  ngOnInit() {
    this.loadClientes();
    this.setCurrentDate();
  }

  setCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    this.currentDate = `${day}/${month}/${year}`;
  }

  async loadClientes() {
    this.isLoading = true;
    try {
      const response = await this.clienteService.getClientes();
      if (response.status === 200) {
        this.clientes = response.clientes;
      } else {
        this.showAlert('Error', 'No se pudieron cargar los clientes');
      }
    } catch (error: any) {
      console.error('Error loading clientes:', error);
      this.showAlert('Error', error.error?.message || 'Error al cargar los clientes');
    } finally {
      this.isLoading = false;
    }
  }

  getClientesActivos(): number {
    return this.clientes.filter(cliente => cliente.estado === 1 || cliente.estado === true).length;
  }

  getClienteInitials(nombres: string): string {
    if (!nombres) return 'C';
    
    const names = nombres.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return nombres.substring(0, 2).toUpperCase();
  }

  async openCreateModal() {
    const modal = await this.modalController.create({
      component: ClienteModalPage,
      componentProps: {
        isEdit: false
      },
      cssClass: 'custom-modal',
      backdropDismiss: false
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.refresh) {
        this.loadClientes();
      }
    });

    await modal.present();
  }

  async openEditModal(cliente: any) {
    const modal = await this.modalController.create({
      component: ClienteModalPage,
      componentProps: {
        isEdit: true,
        cliente: cliente
      },
      cssClass: 'custom-modal',
      backdropDismiss: false
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.refresh) {
        this.loadClientes();
      }
    });

    await modal.present();
  }

  async confirmDelete(cliente: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar al cliente <strong>${cliente.nombres}</strong>?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel'
        },
        {
          text: 'Eliminar',
          cssClass: 'alert-confirm',
          handler: () => {
            this.deleteCliente(cliente.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteCliente(id: number) {
    try {
      const response = await this.clienteService.deleteCliente(id);
      if (response.status === 200) {
        this.showAlert('Éxito', 'Cliente eliminado correctamente');
        this.loadClientes();
      } else {
        this.showAlert('Error', 'No se pudo eliminar el cliente');
      }
    } catch (error: any) {
      console.error('Error deleting cliente:', error);
      this.showAlert('Error', error.error?.message || 'Error al eliminar el cliente');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
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