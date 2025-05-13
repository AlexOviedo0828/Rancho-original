import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-soporte',
  templateUrl: './chat-soporte.component.html',
  styleUrls: ['./chat-soporte.component.scss'],
  standalone: false
})
export class ChatSoporteComponent implements OnInit {
  mensajes: any[] = [];
  mensajeNuevo = '';
  usuarioId = '';
  rol = '';

  @ViewChild('chatScroll') chatScroll!: ElementRef;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.usuarioId = usuario?._id || '';
    this.rol = usuario?.rol || '';
    this.obtenerMensajes();
    setInterval(() => this.obtenerMensajes(), 4000);
  }

  obtenerMensajes(): void {
    this.chatService.obtenerHiloPorUsuario(this.usuarioId).subscribe(
      (mensajes: any) => {
        this.mensajes = mensajes;
        this.scrollAlFinal();
      },
      (err: any) => console.error('❌ Error al obtener mensajes', err)
    );

  }

  enviarMensaje(): void {
    if (!this.mensajeNuevo.trim()) return;

    const data = {
      mensaje: this.mensajeNuevo,
      rol: 'usuario',
      emisor: this.usuarioId,
      usuarioId: this.usuarioId
    };

    this.chatService.crearMensaje(data).subscribe({
      next: () => {
        this.mensajeNuevo = '';
        this.obtenerMensajes();
      },
      error: (err: any) => console.error('❌ Error al enviar mensaje:', err)
    });
  }

  esMio(msg: any): boolean {
    return msg.rol === 'usuario' && msg.usuarioId?.toString() === this.usuarioId;
  }

  private scrollAlFinal(): void {
    setTimeout(() => {
      const el = this.chatScroll?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 100);
  }
}
