import { Injectable, inject } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  private apiUrl = 'http://localhost:8000/api';
  private token: string = '';
  private user: any = null;

  constructor() {
    this.loadStoredData();
  }

  private loadStoredData() {
    try {
      this.token = localStorage.getItem('token') || '';
      const userData = localStorage.getItem('user');
      this.user = userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error loading stored data:', error);
      this.clearStorage();
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('token', this.token);
      localStorage.setItem('user', JSON.stringify(this.user));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private clearStorage() {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        email,
        password
      });

      if (response.data.login && response.data.token) {
        this.token = response.data.token;
        this.user = response.data.user;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  }

  async register(nombre: string, email: string, password: string): Promise<boolean> {
    try {
      const response = await axios.post(`${this.apiUrl}/register`, {
        nombre,
        email,
        password
      });

      if (response.data.token) {
        this.token = response.data.token;
        this.user = response.data.user;
        this.saveToStorage();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Error en el registro');
    }
  }

  // LOGOUT MEJORADO - FORZAR REINICIO
  async logout() {
    try {
      if (this.token) {
        await axios.post(`${this.apiUrl}/logout`, {}, {
          headers: { Authorization: `Bearer ${this.token}` }
        }).catch(error => {
          console.warn('Logout API call failed:', error);
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = '';
      this.user = null;
      this.clearStorage();
      
      // SOLUCIÓN RADICAL: Forzar navegación con recarga de componente
      this.router.navigateByUrl('/login', { 
        replaceUrl: true 
      }).then(() => {
        // Forzar recarga del componente
        window.location.reload();
      });
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string {
    return this.token;
  }

  getUser(): any {
    return this.user;
  }

  async checkAuthState(): Promise<boolean> {
    return this.isAuthenticated();
  }
}