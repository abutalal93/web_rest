import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantsComponent } from './restaurants.component';
import { RestaurantsRoutingModule } from './restaurants-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RestaurantsRoutingModule
  ],
  declarations: [ RestaurantsComponent ]
})
export class RestaurantsModule { }
