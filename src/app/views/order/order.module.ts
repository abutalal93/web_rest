import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    OrderRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ OrderComponent ]
})
export class OrderModule { }
