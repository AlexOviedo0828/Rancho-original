import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: false
})
export class InicioComponent {
  tarjetas = [
    {
      icono: 'bi bi-basket',
      titulo: 'Menú',
      descripcion: 'Explora y haz tu pedido desde tu mesa.',
      ruta: '/home/menu'
    },
    {
      icono: 'bi bi-calendar-check',
      titulo: 'Chat y peticiones',
      descripcion: 'Agrega en el camino ',
      ruta: '/home/chat-soporte'
    },
    {
      icono: 'bi bi-clock-history',
      titulo: 'Mis Reservas',
      descripcion: 'Consulta tus reservas anteriores.',
      ruta: '/home/mis-reservas'
    }
  ];
}
