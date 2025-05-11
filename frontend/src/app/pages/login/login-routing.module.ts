import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login.page';
import { RegistroComponent } from './registro/registro.component';

const routes: Routes = [
  {
    path: '',component: LoginPage
  },
  {
    path: 'registro',
    component: RegistroComponent, // Lazy dentro del mismo módulo
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
