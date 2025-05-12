import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
  standalone: false
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  filtroTexto: string = '';
  filtroEstado: string = '';
  apiUrl: any;
  http: any;

  constructor(private pedidoService: PedidoService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerPedidos();
  }

  obtenerPedidos(): void {
    this.pedidoService.getPedidos().subscribe({
      next: (res: any[]) => {
        console.log('🧾 Pedidos recibidos:', res);
        this.pedidos = res;
      },
      error: (err) => console.error('❌ Error al obtener pedidos:', err)
    });
  }

  pedidosFiltrados(): any[] {
    return this.pedidos.filter(p => {
      const texto = this.filtroTexto.toLowerCase();
      const estadoCoincide = this.filtroEstado
        ? p.estado?.toLowerCase().includes(this.filtroEstado.toLowerCase())
        : true;
      const textoCoincide =
        p.contador_pedido?.toString().includes(texto) ||
        p.usuario?.nombre_completo?.toLowerCase().includes(texto);
      return textoCoincide && estadoCoincide;
    });
  }

  verDetalle(pedido: any): void {
    this.router.navigate(['/admin/detalle-pedido', pedido._id]);
  }

  editarPedido(pedido: any): void {
    this.router.navigate(['/admin/editar-pedido', pedido._id]);
  }
  eliminarPedido(id: string): void {
    if (confirm('¿Eliminar este pedido?')) {
      this.pedidoService.eliminarPedido(id).subscribe({
        next: () => {
          this.pedidos = this.pedidos.filter(p => p._id !== id);
        },
        error: (err) => console.error('❌ Error al eliminar pedido:', err)
      });
    }
  }

}
