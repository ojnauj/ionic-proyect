import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton,
  IonSpinner,
  AlertController 
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonSpinner
  ]
})
export class LoginPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  isRegister: boolean = false;
  nombre: string = '';

  // VARIABLE PARA SABER SI ES UNA NUEVA INSTANCIA
  private isNewInstance: boolean = true;

  ngOnInit() {
    console.log('LoginPage ngOnInit - Nueva instancia:', this.isNewInstance);
    
    // SIEMPRE empezar en modo login
    this.isRegister = false;
    this.resetForm();
    
    // Solo verificar autenticación si es una nueva instancia
    if (this.isNewInstance) {
      this.checkExistingAuth();
      this.isNewInstance = false;
    }
  }

  ngOnDestroy() {
    console.log('LoginPage destruido');
    // Limpiar cualquier estado pendiente
    this.isLoading = false;
  }

  async checkExistingAuth() {
    try {
      const isAuthenticated = await this.authService.checkAuthState();
      if (isAuthenticated) {
        this.router.navigate(['/dashboard']);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    }
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.showAlert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (this.isRegister && !this.nombre) {
      this.showAlert('Error', 'El nombre es requerido para registrarse');
      return;
    }

    this.isLoading = true;

    try {
      let success = false;

      if (this.isRegister) {
        success = await this.authService.register(this.nombre, this.email, this.password);
      } else {
        success = await this.authService.login(this.email, this.password);
      }

      if (success) {
        this.showAlert('Éxito', this.isRegister ? 'Registro exitoso' : 'Login exitoso');
        this.router.navigate(['/dashboard']);
      } else {
        this.showAlert('Error', 'Credenciales incorrectas');
      }
    } catch (error: any) {
      this.showAlert('Error', error.message || 'Ha ocurrido un error');
    } finally {
      this.isLoading = false;
    }
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.resetForm();
  }

  private resetForm() {
    this.email = '';
    this.password = '';
    this.nombre = '';
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  // Método público para resetear desde fuera si es necesario
  public resetToLogin() {
    this.isRegister = false;
    this.resetForm();
  }
}