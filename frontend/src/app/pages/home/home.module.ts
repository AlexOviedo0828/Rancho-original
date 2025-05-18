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
import { ChatSoporteComponent }  from './chat-soporte/chat-soporte.component';

/* Routing */
import { HomeRoutingModule } from './home-routing.module';

/* Angular Material */
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatSelectModule }    from '@angular/material/select';
import { MatListModule }      from '@angular/material/list';
import { MatSnackBarModule }  from '@angular/material/snack-bar';
import { MatButtonModule }    from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HomePage,
    NavMenuComponent,
    InicioComponent,
    MenuComponent,
    ReservaComponent,
    SoporteComponent,
    MisReservasComponent,
    ChatSoporteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HomeRoutingModule,
    MatDialogModule,
    // Material necesarios para MenuComponent
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatSnackBarModule,
    MatButtonModule
  ]
})
export class HomePageModule {}
