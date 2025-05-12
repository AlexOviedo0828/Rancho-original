import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CocinaPageRoutingModule } from './cocina-routing.module';

import { CocinaPage } from './cocina.page';
import { ChatCocinaComponent } from './chat-cocina/chat-cocina.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CocinaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    CocinaPage,
    ChatCocinaComponent,

  ]
})
export class CocinaPageModule {}

