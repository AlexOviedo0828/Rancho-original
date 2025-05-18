import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-chat-cocina',
  templateUrl: './chat-cocina.component.html',
  styleUrls: ['./chat-cocina.component.scss'],
  standalone: false
})
export class ChatCocinaComponent implements OnInit {
  pedidos: any[] = [];
  hilos: any[] = [];
  mensajes: any[] = [];
  pedidoSeleccionado: any = null;
  mensajeNuevo = '';
  selectedUid = '';
  selectedNombre = '';
  contadores: { [reservaId: string]: string } = {};
  temporizadores: { [reservaId: string]: any } = {};
  tiempoRestante: string = '';
  intervalo: any;

  @ViewChild('chatScroll') chatScroll!: ElementRef;
  private API_URL = `${environment.apiUrl}/pedidos`;

  constructor(
    private chat: ChatService,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarHilos();
    setInterval(() => this.cargarHilos(), 4000);
  }

  private headers(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
  }
  cargarPedidos(): void {
    this.http.get<any[]>(this.API_URL, { headers: this.headers() })
      .subscribe({
        next: res => {
          // Ordenar por fecha de llegada (más reciente primero)
          this.pedidos = res.sort((a, b) => {
            const fechaA = new Date(a.fecha).getTime();
            const fechaB = new Date(b.fecha).getTime();
            return fechaB - fechaA;
          });

          this.pedidos.forEach(p => {
            const reserva = p.reserva;
            const id = reserva?._id || p._id;

            // Validación de datos
            if (!reserva) return;

            // ⚠️ Simulación opcional de duración si no existe (evítalo en producción)
            if (!reserva.duracion) {
              reserva.duracion = 20;
            }

            // Usar la fecha de reserva, o la actual si falta
            const fecha = reserva.fecha_reserva || new Date().toISOString();

            // ✅ Iniciar contador si no ha sido creado y el estado no es finalizado
            if (!this.temporizadores[id] && reserva.duracion && p.estado?.toLowerCase() !== 'finalizado') {
              this.iniciarContadorGeneral(id, fecha, reserva.duracion);
            }
          });
        },
        error: err => console.error('❌ Error al cargar pedidos:', err)
      });
  }


  cargarHilos(): void {
    this.chat.obtenerHilos().subscribe({
      next: (h: any[]) => this.hilos = h,
      error: err => console.error('❌ Error al cargar hilos:', err)
    });
  }

  private cargarMensajesDelHilo(): void {
    if (!this.selectedUid) return;
    this.chat.obtenerHiloPorUsuario(this.selectedUid).subscribe(
      (res: any[]) => {
        this.mensajes = res;
        this.scrollAbajo();
      },
      (err: any) => console.error('❌ Error al obtener mensajes:', err)
    );
  }

  seleccionar(uid: string, nombre: string): void {
    if (this.selectedUid === uid) return;
    this.selectedUid = uid;
    this.selectedNombre = nombre;
    this.cargarMensajesDelHilo();
    this.pedidoSeleccionado = null;
  }

  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim() || !this.selectedUid) return;

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    const data = {
      mensaje: this.mensajeNuevo,
      rol: 'cocina',
      emisor: usuario._id,
      usuarioId: this.selectedUid
    };

    this.chat.crearMensaje(data).subscribe({
      next: () => {
        this.mensajeNuevo = '';
        this.cargarMensajesDelHilo();
      },
      error: err => console.error('❌ Error al enviar mensaje:', err)
    });
  }

  actualizarEstado(id: string, estado: string): void {
    this.http.patch(`${this.API_URL}/${id}/estado`, { estado }, { headers: this.headers() })
      .subscribe({
        next: () => {
          // 👇 Buscar el pedido actualizado
          const pedido = this.pedidos.find(p => p._id === id);
          const reservaId = pedido?.reserva?._id || id;

          // ✅ Si el nuevo estado es finalizado, detener el contador
          if (estado.toLowerCase() === 'finalizado' || estado.toLowerCase() === 'entregado') {
            if (this.temporizadores[reservaId]) {
              clearInterval(this.temporizadores[reservaId]);
              delete this.temporizadores[reservaId];
            }
            this.contadores[reservaId] = '🛑 Tiempo finalizado';
          }

          // ✅ Volver a cargar los pedidos con los nuevos estados
          this.cargarPedidos();
        },
        error: err => console.error('❌ Error al actualizar estado:', err)
      });
  }



  verPedido(): void {
    const pedido = this.pedidos.find(p => p.usuario?._id === this.selectedUid);
    this.pedidoSeleccionado = pedido || null;

    if (this.pedidoSeleccionado?.reserva?.fecha_reserva && this.pedidoSeleccionado?.reserva?.duracion) {
      this.iniciarContadorSimulado(this.pedidoSeleccionado.reserva.fecha_reserva, this.pedidoSeleccionado.reserva.duracion);
    }
  }

  cerrarDetalle(): void {
    this.pedidoSeleccionado = null;
    this.tiempoRestante = '';
    clearInterval(this.intervalo);
  }

  private scrollAbajo(): void {
    setTimeout(() => {
      const el = this.chatScroll?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  }
  iniciarContadorGeneral(reservaId: string, fechaReserva: string, duracionMin: number): void {
    if (this.temporizadores[reservaId]) return;

    const inicio = new Date(fechaReserva).getTime();
    const fin = inicio + duracionMin * 60 * 1000;

    this.temporizadores[reservaId] = setInterval(() => {
      const ahora = Date.now();
      const diferencia = fin - ahora;

      // Verificar estado actual
      const pedido = this.pedidos.find(p => (p.reserva?._id || p._id) === reservaId);
      const estado = pedido?.estado?.toLowerCase() || '';

      if (estado === 'finalizado' || estado === 'entregado') {
        this.contadores[reservaId] = '🛑 Tiempo finalizado';
        clearInterval(this.temporizadores[reservaId]);
        delete this.temporizadores[reservaId];
        return;
      }

      if (diferencia <= 0) {
        this.contadores[reservaId] = '🛑 Tiempo finalizado';
        clearInterval(this.temporizadores[reservaId]);
        delete this.temporizadores[reservaId];

        // 🔁 Actualizar estado automáticamente en backend
        if (pedido?._id) {
          const patchUrl = `${this.API_URL}/${pedido._id}/estado`;
          this.http.patch(patchUrl, { estado: 'finalizado' }, { headers: this.headers() })
            .subscribe({
              next: () => {
                console.log(`✅ Pedido ${pedido._id} finalizado automáticamente`);
                this.cargarPedidos(); // Refrescar lista
              },
              error: err => console.error('❌ Error al finalizar automáticamente:', err)
            });
        }

        return;
      }

      const minutos = Math.floor(diferencia / 60000);
      const segundos = Math.floor((diferencia % 60000) / 1000);
      this.contadores[reservaId] = `${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s`;
    }, 1000);
  }

  iniciarContadorSimulado(fechaInicio: string, duracionMin: number): void {
    if (this.intervalo) clearInterval(this.intervalo);
    const inicio = new Date(fechaInicio).getTime();
    const fin = inicio + duracionMin * 60 * 1000;

    this.intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const diferencia = fin - ahora;

      if (diferencia <= 0) {
        this.tiempoRestante = '🛑 Tiempo finalizado';
        clearInterval(this.intervalo);
        this.snackBar.open('⏱ Tiempo de reserva finalizado', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['mat-snack-bar-warning']
        });
        return;
      }

      const minutos = Math.floor(diferencia / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      this.tiempoRestante = `${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s restantes`;
    }, 1000);
  }
  eliminarPedido(id: string): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) return;

    this.http.delete(`${this.API_URL}/${id}`, { headers: this.headers() })
      .subscribe({
        next: () => {
          this.snackBar.open('Pedido eliminado correctamente', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snack-bar-warning']
          });
          this.cargarPedidos(); // Recargar lista
        },
        error: err => {
          console.error('❌ Error al eliminar pedido:', err);
          this.snackBar.open('Error al eliminar el pedido', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-snack-bar-warning']
          });
        }
      });
  }

}
