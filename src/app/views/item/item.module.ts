import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item.component';
import { ItemRoutingModule } from './item-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ItemRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ ItemComponent ]
})
export class ItemModule { }
