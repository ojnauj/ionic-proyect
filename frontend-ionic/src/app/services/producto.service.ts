import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/productos';

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  }

  async getProductos(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(this.apiUrl, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error getting productos:', error);
      throw error;
    }
  }

  async getProducto(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/${id}`, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error getting producto:', error);
      throw error;
    }
  }

  async createProducto(productoData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(this.apiUrl, productoData, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error creating producto:', error);
      throw error;
    }
  }

  async updateProducto(id: number, productoData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.put<any>(`${this.apiUrl}/${id}`, productoData, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error updating producto:', error);
      throw error;
    }
  }

  async deleteProducto(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.delete<any>(`${this.apiUrl}/${id}`, { 
          headers: this.getHeaders() 
        })
      );
      return response;
    } catch (error: any) {
      console.error('Error deleting producto:', error);
      throw error;
    }
  }
}
