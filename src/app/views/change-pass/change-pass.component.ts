import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fadeInOutTranslate } from '../animations/animation';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';
import Swal from 'sweetalert2'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from '../services/auth-service.service';
import { CustomValidationService } from '../services/custom-validation-service.service';

@Component({
  templateUrl: 'change-pass.component.html',
  animations: [fadeInOutTranslate]
})
export class ChangePasswordComponent implements OnInit {


  changePassordForm: FormGroup;

  async ngOnInit() {
    this.loadForm();
  }

  constructor(public authService: AuthService, private httpService: HttpService, private notifyService: NotifyService, private customValidationService: CustomValidationService) {

  }


  loadForm() {
    this.changePassordForm = new FormGroup({
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{4,15}$/)]),
      confirmPassword: new FormControl('', [Validators.required]),
    });

    this.changePassordForm.controls['confirmPassword'].setValidators(this.customValidationService.equalTo(this.changePassordForm.controls['newPassword']));
    this.changePassordForm.updateValueAndValidity();
  }

  markFormGroupToched(){
    (<any>Object).values(this.changePassordForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async save(){

    this.markFormGroupToched();

    if (this.changePassordForm.valid) {

      let request = {
        method: "POST",
        path: "rest/user/changePass",
        body: this.changePassordForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.notifyService.addToast({ title: "Success", msg: "Category Added Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      
        this.changePassordForm.reset();

      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }
}
