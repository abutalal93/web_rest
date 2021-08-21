import { Injectable } from '@angular/core';

@Injectable()
export class NotifyIndicatorService {
  show: boolean = false;
  text: String = "";

  constructor() {}

  viewIndicator(value: boolean , timeout: number=null) {
    this.show = value;
    if(timeout)
    {
      setTimeout(()=>{
          this.show = !this.show;
       }, timeout);
    }
  }

  setText(value: String) {
    this.text =  value;
  }

}
