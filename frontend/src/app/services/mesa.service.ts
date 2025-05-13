import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class MesaService {
  private API_URL = `${environment.apiUrl}/mesas`;

  constructor(private http: HttpClient) {}

  getMesasDisponibles() {
    return this.http.get<any[]>(this.API_URL);
  }
}
