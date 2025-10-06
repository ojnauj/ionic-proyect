import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/clientes';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  async getClientes(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(this.apiUrl, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error getting clientes:', error);
      throw error;
    }
  }

  async getCliente(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/${id}`, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error getting cliente:', error);
      throw error;
    }
  }

  async createCliente(cliente: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, cliente, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error creating cliente:', error);
      throw error;
    }
  }

  async updateCliente(id: number, cliente: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.put<any>(`${this.apiUrl}/${id}`, cliente, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error updating cliente:', error);
      throw error;
    }
  }

  async deleteCliente(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.delete<any>(`${this.apiUrl}/${id}`, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error deleting cliente:', error);
      throw error;
    }
  }
}