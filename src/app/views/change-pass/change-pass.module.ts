import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from './change-pass.component';
import { ChangePasswordRoutingModule } from './change-pass-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  declarations: [ ChangePasswordComponent ]
})
export class ChangePasswordModule { }
