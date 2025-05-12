import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { ReservaComponent } from './reserva/reserva.component';
import { MenuComponent } from './menu/menu.component';
import { SoporteComponent } from './soporte/soporte.component';
import { MisReservasComponent } from './mis-reservas/mis-reservas.component';
import { InicioComponent } from './inicio/inicio.component';
import { ChatSoporteComponent } from './chat-soporte/chat-soporte.component';


const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      { path: '', component: InicioComponent },
      { path: 'reserva', component: ReservaComponent },
      { path: 'menu', component: MenuComponent },
      { path: 'soporte', component: SoporteComponent },
      { path: 'mis-reservas', component: MisReservasComponent },
      { path: 'inicio',component: InicioComponent  },
      {path: 'chat-soporte', component: ChatSoporteComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
