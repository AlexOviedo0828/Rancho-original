import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
  standalone: false
})
export class NavMenuComponent {
  isCollapsed = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
