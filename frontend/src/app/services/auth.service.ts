/* ──────── frontend/src/app/services/auth.service.ts ──────── */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

export interface JwtRespuesta {
  token: string;
  usuario: { _id: string; rol: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  /** URL base del backend sacada del environment */
  private API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  /* ---------- Auth ---------- */
  login(correo: string, contrasena: string) {
    return this.http.post<JwtRespuesta>(`${this.API_URL}/usuarios/login`, { correo, contrasena });
  }

  registro(usuario: { nombre_completo: string; correo: string; contrasena: string }) {
    return this.http.post(`${this.API_URL}/usuarios/registro`, { ...usuario, rol: 'usuario' });
  }

  /* ---------- Roles ---------- */
  getRolPorNombre(nombre: string) {
    return this.http.get<any>(`${this.API_URL}/roles/${nombre}`);
  }

  /* ---------- Helpers ---------- */
  getNombreUsuario(): string {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.nombre_completo || 'Usuario';
    }
    return 'Usuario';
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  getUsuarioId(): string {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    return usuario?._id || '';
  }

  getUsuarioCompleto(): any {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
}
