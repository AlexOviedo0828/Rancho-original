import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.scss'],
  standalone: false
})
export class CrearUsuarioComponent implements OnInit {
  form!: FormGroup;


  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
     private router: Router,
     private snackBar: MatSnackBar,  // 👈 asegúrate que esto esté

     )

     {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre_completo: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['usuario', Validators.required]
    });
  }

  crear(): void {
    if (this.form.invalid) return;

    this.usuarioService.crearDesdeAdmin(this.form.value).subscribe({
      next: () => {
        this.snackBar.open('✅ Usuario creado con éxito', 'Cerrar', { duration: 3000 });
        this.form.reset(); // 👈 limpia los campos
      },
      error: (err) => {
        console.error('❌ Error al crear usuario desde admin:', err);
        this.snackBar.open('❌ Error al crear usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }

}
