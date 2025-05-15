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

  // --------------------------
  // CARGA DE DATOS
  // --------------------------

  private headers(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
  }

  cargarPedidos(): void {
    this.http.get<any[]>(this.API_URL, { headers: this.headers() })
      .subscribe({
        next: res => this.pedidos = res,
        error: err => console.error('❌ Error al cargar pedidos:', err)
      });
  }

  cargarHilos(): void {
    this.chat.obtenerHilos().subscribe({
      next: (h: any[]) => {
        this.hilos = h;

        const nuevos = h.filter(hilo => hilo.sinLeer > 0 && this.selectedUid !== hilo.usuarioId);

      },
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

  // --------------------------
  // INTERACCIÓN
  // --------------------------

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
        next: () => this.cargarPedidos(),
        error: err => console.error('❌ Error al actualizar estado:', err)
      });
  }

  verPedido(): void {
    const pedido = this.pedidos.find(p => p.usuario?._id === this.selectedUid);
    this.pedidoSeleccionado = pedido || null;
  }

  cerrarDetalle(): void {
    this.pedidoSeleccionado = null;
  }

  private scrollAbajo(): void {
    setTimeout(() => {
      const el = this.chatScroll?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  }
}
