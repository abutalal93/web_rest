import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  declarations: [ SettingComponent ]
})
export class SettingModule { }
