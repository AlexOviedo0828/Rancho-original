import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  correo: string = '';
  contrasena: string = '';
  cargando: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login() {
    localStorage.clear(); // 🧹 Limpia todo al intentar iniciar sesión

    if (!this.correo || !this.contrasena) {
      this.mostrarMensaje('Por favor completa todos los campos', 'warning');
      return;
    }

    this.cargando = true;

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        localStorage.setItem('rol', res.usuario.rol);

        this.mostrarMensaje('Bienvenido', 'success');

        setTimeout(() => {
          this.cargando = false;
          const rol = res.usuario.rol;
          if (rol === 'admin') this.router.navigate(['/admin']);
          else if (rol === 'usuario') this.router.navigate(['/home']);
          else if (rol === 'cocina') this.router.navigate(['/cocina/chat-cocina']);
          else this.mostrarMensaje('Rol desconocido.', 'error');
        }, 1500);
      },
      error: (err) => {
        this.cargando = false;
        this.mostrarMensaje(err.error?.mensaje || 'Credenciales incorrectas', 'error');
      }
    });
  }


  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' | 'warning') {
    this.snackBar.open(mensaje, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [`mat-snack-bar-${tipo}`]
    });

  }
}
