import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar-productos.component.html',
  styleUrls: ['./listar-productos.component.scss'],
  standalone: false
})
export class ListarProductosComponent implements OnInit {
  productos: any[] = [];
  terminoBusqueda: string = ''; // 👈 variable del input
  private BASE_URL = 'http://localhost:4000/api/productos';

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos() {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`
    };

    this.http.get<any[]>(this.BASE_URL, { headers }).subscribe({
      next: (res) => {
        this.productos = res;
      },
      error: () => {
        this.snackBar.open('Error al cargar productos', 'Cerrar', { duration: 3000 });
      }
    });
  }


  productosFiltrados() {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase())
    );
  }

  editarProducto(id: string) {
    this.router.navigate(['/admin/editar-producto', id]);
  }

  eliminarProducto(id: string) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`
      };

      this.http.delete(`${this.BASE_URL}/${id}`, { headers }).subscribe({
        next: () => {
          this.snackBar.open('Producto eliminado', 'Cerrar', { duration: 3000 });
          this.obtenerProductos(); // Refrescar la lista
        },
        error: () => {
          this.snackBar.open('Error al eliminar producto', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
  getImgUrl(path: string): string {
    if (!path) return '/assets/img/placeholder.jpg'; // opcional si no hay imagen
    if (path.startsWith('http')) return path;
    if (path.startsWith('/uploads')) path = path.slice(1); // elimina la barra inicial
    return `http://localhost:4000/${path}`;
  }

}
