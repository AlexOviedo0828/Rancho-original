import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';

import { CrearProductoComponent } from './components/crear-producto/crear-producto.component';
import { ListarProductosComponent } from './components/listar-productos/listar-productos.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { DevolucionesComponent } from './components/devoluciones/devoluciones.component';
import { SoporteComponent } from './components/soporte/soporte.component';
import { EditarProductoComponent } from './components/editar-producto/editar-producto.component'; // 👈 IMPORTA AQUÍ
import { EditarPedidoComponent } from './components/editar-pedido/editar-pedido.component';
import { CrearUsuarioComponent } from './crear-usuario/crear-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: NavMenuComponent,
    children: [
      { path: 'crear-producto', component: CrearProductoComponent },
      { path: 'listar-productos', component: ListarProductosComponent },
      { path: 'editar-producto/:id', component: EditarProductoComponent },
      { path: 'pedidos', component: PedidosComponent },
      { path: 'devoluciones', component: DevolucionesComponent },
      { path: 'soporte', component: SoporteComponent },
      { path: 'editar-pedido/:id', component: EditarPedidoComponent }, // ✅ CORREGIDO
      {path: 'crear-usuario' , component: CrearUsuarioComponent},
      { path: '', redirectTo: 'crear-producto', pathMatch: 'full' }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPageRoutingModule {}
