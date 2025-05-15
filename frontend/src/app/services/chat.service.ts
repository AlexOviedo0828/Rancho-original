import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  // ✅ Crear mensaje (tanto usuario como cocina)
  crearMensaje(mensaje: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}`, mensaje, {
      headers: this.getHeaders()
    });
  }

  // ✅ Obtener todos los mensajes del usuario logeado
  obtenerMensajes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Responder mensaje por ID
  responderMensaje(id: string, respuesta: string): Observable<any> {
    return this.http.patch<any>(`${this.API_URL}/${id}/responder`, { respuesta }, {
      headers: this.getHeaders()
    });
  }

  // ✅ Borrar todos los mensajes del usuario actual
  borrarMensajes(): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Obtener lista de hilos (para cocina o admin)
  obtenerHilos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/hilos`, {
      headers: this.getHeaders()
    });
  }

  // ✅ Obtener mensajes por usuario específico (para cocina)
  obtenerHiloPorUsuario(uid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/hilos/${uid}`, {
      headers: this.getHeaders()
    });
  }
}
