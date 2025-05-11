import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-todos-pedidos',
  templateUrl: './todos-pedidos.component.html',
  styleUrls: ['./todos-pedidos.component.scss'],
  standalone: false
})
export class TodosPedidosComponent implements OnInit {
  pedidos: any[] = [];


  constructor(private pedidoService: PedidoService) {}

  ngOnInit(): void {
    this.pedidoService.getPedidos().subscribe({


      next: (res) => this.pedidos = res,
      error: (err) => console.error('❌ Error al obtener pedidos:', err)
    });

  }
}
