import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { RegistroComponent } from './registro/registro.component';

import { LoginPageRoutingModule } from './login-routing.module'; // asegurado
import { LoginPage } from './login.page';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    RegistroComponent,
LoginPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LoginPageRoutingModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class LoginModule {}
