import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss'],
  standalone: false
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  productoId!: string;
  imagenPreview: string | ArrayBuffer | null = null;
  imagenSeleccionada: File | null = null;

  private BASE_URL = 'http://localhost:4000/api/productos';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre: [''],
      descripcion: [''],
      precio: [0],
      categoria: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.productoId = this.route.snapshot.paramMap.get('id') || '';
    this.obtenerProducto();
  }

  obtenerProducto() {
    this.http.get<any>(`${this.BASE_URL}/${this.productoId}`).subscribe({
      next: (data) => {
        this.productoForm.patchValue({
          nombre: data.nombre,
          descripcion: data.descripcion,
          precio: data.precio,
          categoria: data.categoria,
          activo: data.activo
        });
        if (data.imagen) {
          this.imagenPreview = data.imagen.startsWith('http')
  ? data.imagen
  : `http://localhost:4000${data.imagen}`;

        }
      },
      error: () => {
        this.snackBar.open('Error al cargar producto', 'Cerrar', { duration: 3000 });
      }
    });
  }

  seleccionarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = e => this.imagenPreview = reader.result;
      reader.readAsDataURL(file);
    }
  }
  actualizarProducto() {
    const token = localStorage.getItem('token'); // ⬅️ Recupera el token guardado

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const formData = new FormData();
    Object.entries(this.productoForm.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    this.http.put(`${this.BASE_URL}/${this.productoId}`, formData, { headers }).subscribe({
      next: () => {
        this.snackBar.open('Producto actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/listar-productos']);
      },
      error: () => {
        this.snackBar.open('Error al actualizar producto', 'Cerrar', { duration: 3000 });
      }
    });
  }


}
