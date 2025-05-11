import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PedidoService } from 'src/app/services/pedido.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.scss'],
  standalone: false
})
export class EditarPedidoComponent implements OnInit {
  pedidoForm!: FormGroup;
  pedidoId!: string;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.pedidoId = this.route.snapshot.paramMap.get('id') || '';
    this.pedidoService.getPedidoPorId(this.pedidoId).subscribe({
      next: (pedido) => {
        this.pedidoForm = this.fb.group({
          estado: [pedido.estado],
          metodo_pago: [pedido.metodo_pago],
          total: [pedido.total],
          fecha: [pedido.fecha],
          mesa: [pedido.mesa?._id || ''],
          productos: this.fb.array(pedido.productos.map((p: { producto: { _id: any; nombre: any; }; cantidad: any; precio_unitario: any; }) => this.fb.group({
            producto: [p.producto?._id || ''],
            nombre: [p.producto?.nombre || ''],
            cantidad: [p.cantidad],
            precio_unitario: [p.precio_unitario]
          })))
        });
      },
      error: (err) => console.error('❌ Error al obtener pedido:', err)
    });
  }

  get productosForm(): FormArray {
    return this.pedidoForm.get('productos') as FormArray;
  }

  guardarCambios(): void {
    if (this.pedidoForm.valid) {
      const body = this.pedidoForm.value;
      // Remover 'nombre' del cuerpo antes de enviar al backend
      body.productos = body.productos.map((p: any) => ({
        producto: p.producto,
        cantidad: p.cantidad,
        precio_unitario: p.precio_unitario
      }));

      this.pedidoService.actualizarPedido(this.pedidoId, body).subscribe({
        next: () => {
          alert('✅ Pedido actualizado correctamente');
          this.router.navigate(['/admin/pedidos']);
        },
        error: (err) => console.error('❌ Error al actualizar pedido:', err)
      });
    }
  }
}
