// src/app/services/chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

type Rol = 'usuario' | 'admin' | 'cocina';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private readonly api = 'http://localhost:4000/api/chat';

  constructor(private http: HttpClient) {}

  private headers(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
  }

  /** Solo cocina/admin */
  getHilos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/hilos`, { headers: this.headers() });
  }

  obtenerMensajesPorUsuario(uid: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/hilos/${uid}`, {
      headers: this.headers()
    });
  }


  /** Usuario obtiene sus propios mensajes */
  obtenerMisMensajes(): Observable<any[]> {
    return this.http.get<any[]>(this.api, { headers: this.headers() });
  }

  enviarMensaje(data: {
    mensaje: string;
    rol: Rol;
    usuarioId: string;
    emisor?: string;
  }): Observable<any> {
    return this.http.post(this.api, data, { headers: this.headers() });
  }

  responderMensaje(id: string, respuesta: string): Observable<any> {
    return this.http.put(`${this.api}/${id}/responder`, { respuesta }, {
      headers: this.headers()
    });
  }

  limpiarMensajesUsuario(): Observable<any> {
    return this.http.delete(`${this.api}/limpiar`, { headers: this.headers() });
  }
}
