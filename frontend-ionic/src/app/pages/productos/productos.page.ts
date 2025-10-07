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
import { ProductoService } from '../../services/producto.service';
import { ProductoModalPage } from '../../modals/producto-modal/producto-modal.page';
import { addIcons } from 'ionicons';
import { 
  logOut, 
  arrowBack,
  add,
  cube,
  refresh,
  time,
  addCircle,
  create,
  trash,
  list
} from 'ionicons/icons';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
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
export class ProductosPage implements OnInit {
  private authService = inject(AuthService);
  private productoService = inject(ProductoService);
  private router = inject(Router);
  private alertController = inject(AlertController);
  private modalController = inject(ModalController);

  productos: any[] = [];
  isLoading: boolean = false;
  currentDate: string = '';

  constructor() {
    // Agregar todos los iconos necesarios
    addIcons({ 
      logOut, 
      arrowBack,
      add,
      cube,
      refresh,
      time,
      addCircle,
      create,
      trash,
      list
    });
  }

  ngOnInit() {
    this.loadProductos();
    this.setCurrentDate();
  }

  setCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    this.currentDate = `${day}/${month}/${year}`;
  }

  async loadProductos() {
    this.isLoading = true;
    try {
      const response = await this.productoService.getProductos();
      if (response.status === 200) {
        this.productos = response.productos;
      } else {
        this.showAlert('Error', 'No se pudieron cargar los productos');
      }
    } catch (error: any) {
      console.error('Error loading productos:', error);
      this.showAlert('Error', error.error?.message || 'Error al cargar los productos');
    } finally {
      this.isLoading = false;
    }
  }

  // Nueva función getProductosActivos
  getProductosActivos(): number {
    return this.productos.filter(producto => producto.estado === 1 || producto.estado === true).length;
  }

  async openCreateModal() {
    const modal = await this.modalController.create({
      component: ProductoModalPage,
      componentProps: {
        isEdit: false
      },
      cssClass: 'custom-modal',
      backdropDismiss: false
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.refresh) {
        this.loadProductos();
      }
    });

    await modal.present();
  }

  async openEditModal(producto: any) {
    const modal = await this.modalController.create({
      component: ProductoModalPage,
      componentProps: {
        isEdit: true,
        producto: producto
      },
      cssClass: 'custom-modal',
      backdropDismiss: false
    });

    modal.onDidDismiss().then((result) => {
      if (result.data?.refresh) {
        this.loadProductos();
      }
    });

    await modal.present();
  }

  async confirmDelete(producto: any) {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el producto <strong>${producto.nombre_producto}</strong>?`,
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
            this.deleteProducto(producto.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteProducto(id: number) {
    try {
      const response = await this.productoService.deleteProducto(id);
      if (response.status === 200) {
        this.showAlert('Éxito', 'Producto eliminado correctamente');
        this.loadProductos();
      } else {
        this.showAlert('Error', 'No se pudo eliminar el producto');
      }
    } catch (error: any) {
      console.error('Error deleting producto:', error);
      this.showAlert('Error', error.error?.message || 'Error al eliminar el producto');
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
