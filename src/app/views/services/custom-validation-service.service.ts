import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';


@Injectable()
export class CustomValidationService {

  constructor() { }

  equalTo(field: AbstractControl): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
  
      let input = control.value;
  
      let isValid = field.value == input
      if (!isValid)
        return { 'equalto': { isValid } }
      else
        return null;
    };
  }
}
