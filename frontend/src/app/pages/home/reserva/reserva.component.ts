import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MesaService } from 'src/app/services/mesa.service';
import { ReservaService } from 'src/app/services/reserva.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.scss'],
  standalone: false
})
export class ReservaComponent implements OnInit {
  formReserva: FormGroup;
  mesas: any[] = [];
  usuarioId = '';
  pedidoId: string = '';
  ultimoNumeroReserva = 0;

  constructor(
    private fb: FormBuilder,
    private mesaService: MesaService,
    private reservaService: ReservaService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formReserva = this.fb.group({
      mesa: ['', Validators.required],
      fecha_reserva: ['', Validators.required],
      duracion: ['', [Validators.required, Validators.min(30)]],
      detalle_entrega: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.authService.getUsuarioId();
    this.cargarMesas();
    this.obtenerUltimoNumeroReserva();

    this.route.queryParams.subscribe(params => {
      this.pedidoId = params['pedido'];
      if (!this.pedidoId) {
        this.snackBar.open('❌ No se recibió el ID del pedido', 'Cerrar', { duration: 4000 });
      }
    });
  }

  get detalleEntrega(): FormArray {
    return this.formReserva.get('detalle_entrega') as FormArray;
  }

  agregarDetalle(): void {
    this.detalleEntrega.push(
      this.fb.group({
        descripcion: ['', Validators.required],
        tiempo: ['', [Validators.required, Validators.min(1)]]
      })
    );
  }

  eliminarDetalle(i: number): void {
    this.detalleEntrega.removeAt(i);
  }

  cargarMesas(): void {
    this.mesaService.getMesasDisponibles().subscribe({
      next: data => (this.mesas = data),
      error: () => this.snackBar.open('Error al cargar mesas', 'Cerrar', { duration: 3000 })
    });
  }

  obtenerUltimoNumeroReserva(): void {
    this.http.get<any[]>(`${environment.apiUrl}/reservas`).subscribe({
      next: (reservas) => {
        const ult = reservas.map(r => r.numero_reserva || 0);
        this.ultimoNumeroReserva = Math.max(...ult, 0);
      },
      error: () => {
        this.snackBar.open('Error al obtener reservas previas', 'Cerrar', { duration: 3000 });
      }
    });
  }

  reservar(): void {
    if (this.formReserva.invalid) {
      this.snackBar.open('Completa todos los campos obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }

    const reserva = {
      ...this.formReserva.value,
      usuario: this.usuarioId,
      numero_reserva: this.ultimoNumeroReserva + 1
    };

    this.reservaService.crearReserva(reserva).subscribe({
      next: (res: any) => {
        const idReserva = res._id;
        localStorage.setItem('numeroReserva', res.numero_reserva);

        const token = localStorage.getItem('token') || '';
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        this.http.patch<any>(`${environment.apiUrl}/pedidos/${this.pedidoId}`, {
          reserva: idReserva
        }, { headers }).subscribe({
          next: (pedidoActualizado: any) => {
            this.snackBar.open(`✅ Pedido actualizado con reserva (N° ${pedidoActualizado.numero_pedido})`, 'Cerrar', { duration: 4000 });
            this.router.navigate(['/home']);
          },
          error: () => {
            this.snackBar.open('❌ Error al actualizar el pedido', 'Cerrar', { duration: 4000 });
          }
        });
      },
      error: err => {
        const msg = err.error?.mensaje || '❌ No se pudo crear la reserva';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
