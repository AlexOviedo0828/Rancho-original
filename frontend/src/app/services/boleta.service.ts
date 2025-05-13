import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  private API_URL = `${environment.apiUrl}/boletas`;

  constructor(private http: HttpClient) {}

  getBoleta(id: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });

    return this.http.get(`${this.API_URL}/${id}`, { headers });
  }
}
