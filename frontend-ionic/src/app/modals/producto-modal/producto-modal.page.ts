import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
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
  IonButtons,
  ModalController,
  AlertController
} from '@ionic/angular/standalone';
import { ProductoService } from '../../services/producto.service';
import { addIcons } from 'ionicons';
import { 
  close,
  create,
  cube,
  pricetag,
  clipboard,
  analytics,
  image,
  power,
  checkmarkCircle,
  closeCircle,
  save,
  addCircle
} from 'ionicons/icons';

@Component({
  selector: 'app-producto-modal',
  templateUrl: './producto-modal.page.html',
  styleUrls: ['./producto-modal.page.scss'],
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
export class ProductoModalPage implements OnInit {
  private productoService = inject(ProductoService);
  private modalController = inject(ModalController);
  private alertController = inject(AlertController);

  isEdit: boolean = false;
  isLoading: boolean = false;
  productoData: any = {
    nombre_producto: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    unidad_medida: '',
    marca: '',
    imagen: '',
    estado: true
  };

  constructor() {
    addIcons({ 
      close,
      create,
      cube,
      pricetag,
      clipboard,
      analytics,
      image,
      power,
      checkmarkCircle,
      closeCircle,
      save,
      addCircle
    });
  }

  ngOnInit() {
    if (this.isEdit && (this as any).producto) {
      const producto = (this as any).producto;
      this.productoData = {
        nombre_producto: producto.nombre_producto || '',
        descripcion: producto.descripcion || '',
        precio: producto.precio || 0,
        stock: producto.stock || 0,
        unidad_medida: producto.unidad_medida || '',
        marca: producto.marca || '',
        imagen: producto.imagen || '',
        estado: producto.estado === 1 || producto.estado === true
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
        const productoId = (this as any).producto.id;
        response = await this.productoService.updateProducto(productoId, this.productoData);
      } else {
        response = await this.productoService.createProducto(this.productoData);
      }

      if (response.status === 200 || response.status === 201) {
        this.showAlert('Éxito', this.isEdit ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        this.dismiss(true);
      } else {
        this.showAlert('Error', response.message || 'Ha ocurrido un error');
      }
    } catch (error: any) {
      console.error('Error saving producto:', error);
      this.showAlert('Error', error.error?.message || 'Error al guardar el producto');
    } finally {
      this.isLoading = false;
    }
  }

  validateForm(): boolean {
    if (!this.productoData.nombre_producto || 
        !this.productoData.descripcion || 
        !this.productoData.precio || 
        !this.productoData.stock || 
        !this.productoData.unidad_medida) {
      this.showAlert('Error', 'Por favor completa todos los campos obligatorios');
      return false;
    }

    if (this.productoData.precio <= 0) {
      this.showAlert('Error', 'El precio debe ser mayor a 0');
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
