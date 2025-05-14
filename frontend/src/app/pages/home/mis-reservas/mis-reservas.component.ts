import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mis-reservas',
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.scss'],
  standalone: false
})
export class MisReservasComponent implements OnInit {
  reservas: any[] = [];
  usuarioId: string = '';
  boletas: { [pedidoId: string]: any } = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.usuarioId = this.authService.getUsuarioId();
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.http.get<any[]>(`${environment.apiUrl}/pedidos`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (res) => {
        const pedidosUsuario = res.filter(p => p.usuario._id === this.usuarioId);
        this.reservas = pedidosUsuario;
        pedidosUsuario.forEach(p => this.obtenerBoleta(p._id));
      },
      error: (err) => console.error('Error al cargar reservas', err)
    });
  }

  obtenerBoleta(pedidoId: string): void {
    this.http.get<any>(`${environment.apiUrl}/boletas/pedido/${pedidoId}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (boleta) => this.boletas[pedidoId] = boleta,
      error: () => this.boletas[pedidoId] = null
    });
  }

  generarBoleta(pedido: any): void {
    const total_neto = pedido.total;
    const payload = {
      total_neto,
      pedido: pedido._id
    };

    this.http.post(`${environment.apiUrl}/boletas`, payload, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).subscribe({
      next: (boleta) => {
        this.boletas[pedido._id] = boleta;
        alert('✅ Boleta generada correctamente');
      },
      error: (err) => {
        console.error(err);
        alert('❌ Error al generar la boleta');
      }
    });
  }

  descargarBoleta(id: string): void {
    window.open(`${environment.apiUrl}/boletas/${id}/descargar`, '_blank');
  }
}
