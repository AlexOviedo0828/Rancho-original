import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoletaService {
  http: any;
  api: any;
  authHeaders: any;

  constructor() { }

// boleta.service.ts
getBoleta(id: string) {
  return this.http.get(`${this.api}/boletas/${id}`, {
    headers: this.authHeaders
  });
}
}
