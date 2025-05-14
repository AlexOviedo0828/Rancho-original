import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarDialogComponent } from 'src/app/dialogs/confirmar-dialog/confirmar-dialog.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: false
})
export class MenuComponent implements OnInit {
  categorias: any[] = [];
  categoriaActual: any;
  carrito: any[] = [];
  mostrarCarrito = false;
  mesaSeleccionadaId = '';
  fechaElegida = '';
  duracionSeleccionada = 60;
  entregas: { descripcion: string; tiempo: number }[] = [];
  nuevaEntrega = { descripcion: '', tiempo: 0 };
  mesas: any[] = [];
  boletaGenerada: any = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.http.get<any[]>(`${environment.apiUrl}/productos`).subscribe({
      next: (productos) => {
        const map = new Map<string, any[]>();
        productos.forEach(p => {
          const cat = p.categoria || 'Sin categoría';
          if (!map.has(cat)) map.set(cat, []);
          map.get(cat)!.push(p);
        });
        this.categorias = Array.from(map, ([nombre, productos]) => ({ nombre, productos }));
        this.categoriaActual = this.categorias[0];
      },
      error: () => alert('Error al cargar productos')
    });

    this.http.get<any[]>(`${environment.apiUrl}/mesas`).subscribe({
      next: (mesas) => this.mesas = mesas,
      error: () => alert('Error al cargar mesas')
    });
  }

  seleccionarCategoria(categoria: any) {
    this.categoriaActual = categoria;
  }

  agregar(producto: any) {
    const item = this.carrito.find(i => i.producto._id === producto._id);
    if (item) {
      item.cantidad++;
      item.subtotal = item.producto.precio * item.cantidad;
    } else {
      this.carrito.push({ producto, cantidad: 1, subtotal: producto.precio });
    }
  }

  quitar(producto: any) {
    const index = this.carrito.findIndex(i => i.producto._id === producto._id);
    if (index !== -1) {
      if (this.carrito[index].cantidad > 1) {
        this.carrito[index].cantidad--;
        this.carrito[index].subtotal = this.carrito[index].cantidad * producto.precio;
      } else {
        this.carrito.splice(index, 1);
      }
    }
  }

  vaciar() {
    this.carrito = [];
    this.entregas = [];
  }

  get neto(): number {
    return this.carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

  get iva(): number {
    return Math.round(this.neto * 0.19);
  }

  get totalCantidad(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  getTotal(): number {
    return this.neto + this.iva;
  }
  getImgUrl(nombre: string): string {
    if (!nombre) return '../../../../assets/img/Diseño sin título.jpg';

    if (nombre.startsWith('/')) nombre = nombre.slice(1); // Quita barra inicial
    if (!nombre.startsWith('uploads')) nombre = 'uploads/' + nombre;

    // Usa el host sin `/api`
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}/${nombre}`;
  }



  agregarEntrega() {
    if (this.nuevaEntrega.descripcion && this.nuevaEntrega.tiempo > 0) {
      this.entregas.push({ ...this.nuevaEntrega });
      this.nuevaEntrega = { descripcion: '', tiempo: 0 };
    }
  }

  confirmarPedido() {
    if (!this.mesaSeleccionadaId || !this.fechaElegida || !this.duracionSeleccionada || this.carrito.length === 0) {
      this.snackBar.open('⚠️ Completa todos los campos y agrega productos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmarDialogComponent);

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        const usuarioGuardado = localStorage.getItem('usuario');
        if (!usuarioGuardado) return alert('Usuario no autenticado.');

        const usuario = JSON.parse(usuarioGuardado)._id;
        const datosCompletos = {
          usuario,
          mesa: this.mesaSeleccionadaId,
          productos: this.carrito.map(i => ({
            producto: i.producto._id,
            cantidad: i.cantidad,
            precio_unitario: i.producto.precio
          })),
          total: this.getTotal(),
          metodo_pago: 'efectivo',
          fecha_reserva: this.fechaElegida,
          duracion: this.duracionSeleccionada,
          detalle_entrega: this.entregas
        };

        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.post<any>(`${environment.apiUrl}/pedidos`, datosCompletos, { headers }).subscribe({
          next: (pedido) => {
            this.generarBoleta(pedido._id);
            this.vaciar();
            this.mostrarCarrito = false;
            this.snackBar.open('✅ Pedido enviado correctamente', 'Cerrar', { duration: 3000 });
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('❌ Error al enviar el pedido', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }

  generarBoleta(pedidoId: string) {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>(`${environment.apiUrl}/boletas`, {
      pedido: pedidoId,
      total_neto: this.neto
    }, { headers }).subscribe({
      next: (boleta) => {
        this.boletaGenerada = boleta;
        this.descargarBoleta();
      },
      error: (err) => console.error('Error al generar boleta', err)
    });
  }

  descargarBoleta() {
    if (!this.boletaGenerada?._id) return;

    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${environment.apiUrl}/boletas/${this.boletaGenerada._id}/descargar`, {
      headers,
      responseType: 'blob'
    }).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleta_${this.boletaGenerada.numero_boleta}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  volverInicio() {
    this.router.navigate(['/home']);
  }
}
