import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuRoutingModule } from './menu-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ MenuComponent ]
})
export class MenuModule { }
