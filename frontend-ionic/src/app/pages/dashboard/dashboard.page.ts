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
  AlertController,
  IonButtons
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { addIcons } from 'ionicons';
import { 
  logOut, 
  person, 
  mail, 
  idCard, 
  shieldCheckmark,
  time,
  calendar,
  trendingUp,
  personCircle,
  key,
  people,
  cube,
  chevronForward
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
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
    IonButtons
  ]
})
export class DashboardPage implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertController = inject(AlertController);

  user: any = null;
  currentDate: string = '';

  constructor() {
    // Agregar todos los iconos necesarios
    addIcons({ 
      logOut, 
      person, 
      mail, 
      idCard,
      shieldCheckmark,
      time,
      calendar,
      trendingUp,
      personCircle,
      key,
      people,
      cube,
      chevronForward
    });
  }

  ngOnInit() {
    this.loadUserData();
    this.setCurrentDate();
  }

  loadUserData() {
    this.user = this.authService.getUser();
    console.log('Usuario cargado desde AuthService:', this.user);
    
    if (!this.user) {
      console.log('No hay usuario, redirigiendo a login...');
      this.router.navigate(['/login']);
      return;
    }

    // Asegurarse de que los datos estén en el formato correcto
    if (!this.user.id && this.user.user_id) {
      this.user.id = this.user.user_id;
    }
    if (!this.user.nombre && this.user.name) {
      this.user.nombre = this.user.name;
    }
  }

  setCurrentDate() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    this.currentDate = `${day}/${month}`;
  }

  getUserInitials(): string {
    if (!this.user?.nombre) return 'U';
    
    const names = this.user.nombre.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.user.nombre.substring(0, 2).toUpperCase();
  }

  getWelcomeMessage(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel'
        },
        {
          text: 'Cerrar Sesión',
          cssClass: 'alert-confirm',
          handler: () => {
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }
}