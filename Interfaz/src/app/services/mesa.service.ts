import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn:'root' })
export class MesaService {
  private api='http://localhost:4000/api/mesas';
  constructor(private http:HttpClient){}
  getMesasDisponibles(){ return this.http.get<any[]>(this.api); }
}
