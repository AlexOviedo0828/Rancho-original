import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  private apiUrl = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  crearPedido(body: any) {
    return this.http.post(this.apiUrl, body, { headers: this.getHeaders() });
  }

  getPedidos() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getPedidoPorId(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  actualizarPedido(id: string, body: any) {
    return this.http.put(`${this.apiUrl}/${id}`, body, { headers: this.getHeaders() });
  }

  eliminarPedido(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
