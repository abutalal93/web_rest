import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './order-history.component';
import { OrderHistoryRoutingModule } from './order-history-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    OrderHistoryRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  declarations: [ OrderHistoryComponent ]
})
export class OrderHistoryModule { }
