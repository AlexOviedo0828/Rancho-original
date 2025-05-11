import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminPageRoutingModule } from './admin-routing.module';

// Componentes
import { EditarProductoComponent } from './components/editar-producto/editar-producto.component';
import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { EditarPedidoComponent } from './components/editar-pedido/editar-pedido.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';


// agrega todos los demás componentes...

@NgModule({
  declarations: [
    EditarProductoComponent,
    CrearProductoComponent,
    ListarProductosComponent,
    NavMenuComponent,
    PedidosComponent,
  EditarPedidoComponent,
  CrearUsuarioComponent

    // ...otros componentes
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatSnackBarModule,
    AdminPageRoutingModule,
    MatSnackBarModule,

  ]
})
export class AdminModule{}
