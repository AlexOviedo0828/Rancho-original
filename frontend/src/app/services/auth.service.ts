import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface JwtRespuesta {
  token: string;
  usuario: { _id: string; rol: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private API_URL = 'http://localhost:4000/api/usuarios';

  constructor(private http: HttpClient) {}

  login(correo: string, contrasena: string) {
    return this.http.post<JwtRespuesta>(`${this.API_URL}/login`, { correo, contrasena });
  }

  registro(usuario: { nombre_completo: string; correo: string; contrasena: string }) {
    return this.http.post(`${this.API_URL}/registro`, { ...usuario, rol: 'usuario' });
  }

  getRolPorNombre(nombre: string) {
    return this.http.get<any>(`http://localhost:4000/api/roles/${nombre}`);
  }

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
