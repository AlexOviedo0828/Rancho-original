import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  standalone: false
})
export class NavMenuComponent {
  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigate([ruta]);
  }
}
