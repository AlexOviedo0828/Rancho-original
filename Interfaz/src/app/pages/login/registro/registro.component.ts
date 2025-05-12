import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: false
})
export class RegistroComponent implements OnInit {
  usuario = {
    nombre_completo: '',
    correo: '',
    contrasena: '',
    rol: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  rolCargado = false;

  ngOnInit(): void {
    this.authService.getRolPorNombre('usuario').subscribe({
      next: (res) => {
        this.usuario.rol = res._id;
        this.rolCargado = true;
        console.log('✅ Rol cargado:', this.usuario.rol); // para validar en consola
      },
      error: () => {
        this.snackBar.open('Error al cargar rol.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }
  registrarse() {
    const data = {
      nombre_completo: this.usuario.nombre_completo,
      correo:          this.usuario.correo,
      contrasena:      this.usuario.contrasena,   // ✅
      rol:             this.usuario.rol
    };

    this.authService.registro(data).subscribe({
      next: () => {
        this.snackBar.open('¡Registro exitoso!', 'Cerrar', { duration: 3000, panelClass: ['snack-success'] });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.snackBar.open(err.error?.mensaje || 'Error al registrar.', 'Cerrar', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }


}
