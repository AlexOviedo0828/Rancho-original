import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


/* Componentes */
import { HomePage }              from './home.page';
import { NavMenuComponent }      from './nav-menu/nav-menu.component';
import { InicioComponent }       from './inicio/inicio.component';
import { MenuComponent }         from './menu/menu.component';
import { ReservaComponent }      from './reserva/reserva.component';
import { SoporteComponent }      from './soporte/soporte.component';
import { MisReservasComponent }  from './mis-reservas/mis-reservas.component';

import { HomeRoutingModule }     from './home-routing.module';
import { ChatSoporteComponent } from './chat-soporte/chat-soporte.component';

@NgModule({
  declarations: [
    HomePage,
    NavMenuComponent,
    InicioComponent,
    MenuComponent,
    ReservaComponent,
    SoporteComponent,
    MisReservasComponent,
    ChatSoporteComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,



    HomeRoutingModule
  ]
})
export class HomePageModule {}
