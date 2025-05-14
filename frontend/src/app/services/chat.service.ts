import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private API_URL = `${environment.apiUrl}/chat`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`
    });
  }

  // Crear mensaje (tanto usuario como cocina)
  crearMensaje(mensaje: any) {
    return this.http.post(`${this.API_URL}`, mensaje, {
      headers: this.getHeaders()
    });
  }

  // Obtener todos los mensajes del usuario logeado (rol usuario o cocina)
  obtenerMensajes() {
    return this.http.get(`${this.API_URL}`, {
      headers: this.getHeaders()
    });
  }

  // Responder mensaje por ID
  responderMensaje(id: string, respuesta: string) {
    return this.http.patch(`${this.API_URL}/${id}/responder`, { respuesta }, {
      headers: this.getHeaders()
    });
  }

  // Borrar todos los mensajes del usuario actual
  borrarMensajes() {
    return this.http.delete(`${this.API_URL}`, {
      headers: this.getHeaders()
    });
  }

  // Obtener lista de hilos (solo cocina o admin)
  obtenerHilos() {
    return this.http.get(`${this.API_URL}/hilos`, {
      headers: this.getHeaders()
    });
  }

  obtenerHiloPorUsuario(uid: string) {
    return this.http.get(`${this.API_URL}/hilos/${uid}`, {
      headers: this.getHeaders()
    });
  }

}
