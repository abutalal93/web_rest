import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingComponent } from './setting.component';
import { SettingRoutingModule } from './setting-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SettingRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ SettingComponent ]
})
export class SettingModule { }
