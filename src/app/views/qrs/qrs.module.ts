import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrsComponent } from './qrs.component';
import { QrsRoutingModule } from './qrs-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxQrWithImageModule } from 'ngx-qr-with-image';
// import { QRCodeModule } from 'angular2-qrcode';


@NgModule({
  imports: [
    CommonModule,
    QrsRoutingModule,
    ReactiveFormsModule,
    QRCodeModule,
    NgxQrWithImageModule
  ],
  declarations: [ QrsComponent ]
})
export class QrsModule { }
