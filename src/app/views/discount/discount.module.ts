import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountComponent } from './discount.component';
import { DiscountRoutingModule } from './discount-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    DiscountRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  declarations: [ DiscountComponent ]
})
export class DiscountModule { }
