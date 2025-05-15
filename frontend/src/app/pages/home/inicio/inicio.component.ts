import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: false
})
export class InicioComponent implements OnInit {
  tarjetas = [
    {
      icono: 'bi bi-egg-fried',
      titulo: 'Ver Menú',
      descripcion: 'Explora nuestras hamburguesas y combos',
      ruta: '/home/menu'
    },
    {
      icono: 'bi bi-calendar-check',
      titulo: 'Mis Reservas',
      descripcion: 'Revisa tus reservas activas y pasadas',
      ruta: '/home/mis-reservas'
    },
    {
      icono: 'bi bi-chat-left-text',
      titulo: 'Soporte',
      descripcion: '¿Dudas? Escríbenos directamente',
      ruta: '/home/chat-soporte'
    }
  ];

  ofertas = [
    {
      titulo: '2x1 en Hamburguesa sencilla',
      descripcion: 'Lunes y miércoles todas las Hamburguesas al 2x1',
      imagen: '../../../../assets/img/images-2.jpg'
    },
    {
      titulo: 'Cerveza gratis',
      descripcion: 'Por compras sobre $8.000 llevas una cerveza gratis',
      imagen: '../../../../assets/img/79oXGedSu2jLRggTY-300-x.jpg'
    },
    {
      titulo: 'Combo familiar',
      descripcion: 'Combo 4 personas con 20% de descuento',
      imagen: '../../../../assets/img/combo3.jpg'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
