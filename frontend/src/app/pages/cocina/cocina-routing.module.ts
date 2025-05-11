import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CocinaPage } from './cocina.page';
import { ChatCocinaComponent } from './chat-cocina/chat-cocina.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ChatThreadComponent } from './chat-thread/chat-thread.component';


const routes: Routes = [
  {
    path: '',
    component: CocinaPage,

  },
  {
    path: 'chat-cocina',
    component: ChatCocinaComponent
  },
  {
    path: 'cliente-list',
    component: ClienteListComponent
  },
  {
    path: 'chat-thread',
    component: ChatThreadComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CocinaPageRoutingModule {}
