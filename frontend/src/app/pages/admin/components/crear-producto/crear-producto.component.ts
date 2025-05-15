import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss'],
  standalone: false
})
export class CrearProductoComponent {
  productoForm!: FormGroup;
  imagenSeleccionada: File | null = null;
  private BASE_URL = `${environment.apiUrl}/productos`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public router: Router,
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

  seleccionarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
    }
  }

  guardarProducto() {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const formData = new FormData();
    const form = this.productoForm.value;

    formData.append('nombre', form.nombre);
    formData.append('descripcion', form.descripcion);
    formData.append('precio', form.precio.toString());
    formData.append('categoria', form.categoria);
    formData.append('activo', form.activo.toString());

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    this.http.post(this.BASE_URL, formData, { headers }).subscribe({
      next: () => {
        this.snackBar.open('Producto creado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin/listar-productos']);
      },
      error: () => {
        this.snackBar.open('Error al crear producto', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
