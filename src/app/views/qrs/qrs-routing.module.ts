import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QrsComponent } from './qrs.component';

const routes: Routes = [
  {
    path: '',
    component: QrsComponent,
    data: {
      title: 'Qr Managment'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QrsRoutingModule {}
