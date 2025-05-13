import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  selectedUid = '';
  selectedNombre = '';

  mensajes: any[] = [];
  mensajeNuevo = '';

  @ViewChild('chatScroll') chatScroll!: ElementRef;

  private API_URL = `${environment.apiUrl}/pedidos`;

  constructor(
    private chat: ChatService,
    private http: HttpClient
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
    this.http
      .get<any[]>(this.API_URL, { headers: this.headers() })
      .subscribe({
        next: (res: any[]) => (this.pedidos = res),
        error: (err: any) => console.error('❌ Error al cargar pedidos:', err)
      });
  }

  actualizarEstado(id: string, estado: string): void {
    this.http
      .patch(
        `${this.API_URL}/${id}/estado`,
        { estado },
        { headers: this.headers() }
      )
      .subscribe({
        next: () => this.cargarPedidos(),
        error: (err: any) => console.error('❌ Error al actualizar estado:', err)
      });
  }

  cargarHilos(): void {
    this.chat.obtenerHilos().subscribe({
      next: (h: any) => (this.hilos = h),
      error: (err: any) => console.error('❌ Error al cargar hilos:', err)
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

    this.chat.obtenerHiloPorUsuario(this.selectedUid).subscribe({
      next: (m: any) => {
        this.mensajes = m;
        this.scrollAbajo();
      },
      error: (err: any) => console.error('❌ Error al obtener mensajes:', err)
    });
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
      error: (err: any) => console.error('❌ Error al enviar mensaje:', err)
    });
  }

  private scrollAbajo(): void {
    setTimeout(() => {
      const el = this.chatScroll?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 50);
  }
}
