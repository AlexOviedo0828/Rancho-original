import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chat-cocina',
  templateUrl: './chat-cocina.component.html',
  styleUrls: ['./chat-cocina.component.scss'],
  standalone: false
})
export class ChatCocinaComponent implements OnInit {

  pedidos: any[] = [];
  hilos: any[] = [];

  selectedUid = '';
  selectedNombre = '';

  mensajes: any[] = [];
  mensajeNuevo = '';

  @ViewChild('chatScroll') chatScroll!: ElementRef;

  constructor(
    private chat: ChatService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
    this.cargarHilos();

    setInterval(() => this.cargarHilos(), 4000);
  }

  private headers() {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` };
  }

  cargarPedidos(): void {
    this.http
      .get<any[]>('http://localhost:4000/api/pedidos', { headers: this.headers() })
      .subscribe({
        next: res => (this.pedidos = res),
        error: err => console.error('❌ Error al cargar pedidos:', err)
      });
  }

  actualizarEstado(id: string, estado: string): void {
    this.http
      .patch(
        `http://localhost:4000/api/pedidos/${id}/estado`,
        { estado },
        { headers: this.headers() }
      )
      .subscribe({
        next: () => this.cargarPedidos(),
        error: err => console.error('❌ Error al actualizar estado:', err)
      });
  }

  cargarHilos(): void {
    this.chat.getHilos().subscribe({
      next: h => (this.hilos = h),
      error: err => console.error('❌ Error al cargar hilos:', err)
    });
  }

  seleccionar(uid: string, nombre: string): void {
    if (this.selectedUid === uid) return;
    this.selectedUid = uid;
    this.selectedNombre = nombre;
    this.cargarMensajesDelHilo();
  }

  private cargarMensajesDelHilo(): void {
    if (!this.selectedUid) {
      this.mensajes = [];
      return;
    }

    this.chat.obtenerMensajesPorUsuario(this.selectedUid).subscribe({
      next: m => {
        this.mensajes = m;
        this.scrollAbajo();
      },
      error: () => console.error('❌ Error al obtener mensajes')
    });
  }
  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim() || !this.selectedUid) return;

    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

    const data: {
      mensaje: string;
      rol: 'cocina';
      emisor: string;
      usuarioId: string;
    } = {
      mensaje: this.mensajeNuevo,
      rol: 'cocina',
      emisor: usuario._id,
      usuarioId: this.selectedUid
    };

    this.chat.enviarMensaje(data).subscribe({
      next: () => {
        this.mensajeNuevo = '';
        this.cargarMensajesDelHilo();
      },
      error: err => console.error('❌ Error al enviar mensaje:', err)
    });
  }


  private scrollAbajo(): void {
    setTimeout(() => {
      const el = this.chatScroll?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  }
}
