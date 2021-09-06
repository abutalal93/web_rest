import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../model/user';
import { AuthService } from '../services/auth-service.service';
import { HttpService } from '../services/http.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'competition.component.html',
  styleUrls: ['competition.component.scss'],
})
export class CompetitionComponent implements OnInit {


  loginForm: FormGroup;
  termForm: FormGroup;
  requestForm: FormGroup;

  position = 'top-center';

  stepOne = true;
  stepTwo = false;
  stepThree = false;
  stepFour = false;
  stepFive = false;


  ngOnInit() {
    this.loadForm();
  }

  constructor(private router: Router, private authService: AuthService, private cookieService: CookieService, private httpService: HttpService, private notifyService: NotifyService) {

  }

  loadForm() {
    this.loginForm = new FormGroup({
      password: new FormControl('', [Validators.required])
    });

    this.termForm = new FormGroup({
      approve: new FormControl('', [Validators.required])
    });

    this.requestForm = new FormGroup({
      fullName: new FormControl('', [Validators.required]),
      mobileNumber: new FormControl('', [Validators.required,Validators.pattern(/^[0][0-9]{9}/)]),
      email: new FormControl('', [Validators.required,Validators.email]),
      attachmentOne: new FormControl('', [Validators.required]),
      attachmentTwo: new FormControl(''),
      attachmentThree: new FormControl(''),
      attachmentFour: new FormControl(''),
      attachmentFive: new FormControl('')
    });
  }

  async login() {
    this.httpService.markFormGroupTouched(this.loginForm);

    if (this.loginForm.valid) {

      if (this.loginForm.value.password === 'Pa$$w0rd') {
        this.notifyService.addToast({ title: "عملية ناجحة", msg: "عملية الدخول صحيحة", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
        this.changeToStep(2);

      } else {
        this.notifyService.addToast({ title: "خطأ", msg: 'الرقم السري غير صحيح', timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }

      // let request = {
      //   method: "POST",
      //   path: "rest/user/login",
      //   body: this.loginForm.value
      // };

      // let response = await this.httpService.httpRequest(request);
      // console.log(response);
      // if(response.status == 200){

      //   this.authService.setIsUserLoggedIn(true);
      //   const user = new User(response.data.id, response.data.token, response.data.firstName + " " +response.data.lastName,response.data.username, response.data.avatar);
      //   this.authService.setLoggedInUser(user);
      //   this.cookieService.set('rest_user', response.data.token);
      //   let url = this.authService.getRedirectUrl();
      //   this.router.navigate([url]).then(() => {
      //   });

      //   this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      // }else{
      //   this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      // }
    }
  }

  async request() {
    this.httpService.markFormGroupTouched(this.requestForm);

    if (this.requestForm.valid) {

      let request = {
        method: "GET",
        path: "notification/email?name="+this.requestForm.value.fullName+"&email="+this.requestForm.value.email,
        body: null
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if (response.status == 200) {

        this.changeToStep(5);

      } else {
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
      
    } else {
      this.notifyService.addToast({ title: "خطأ", msg: 'يرجى ارفاق تصميم واحد على اﻷقل', timeout: 10000, theme: '', position: 'top-center', type: 'error' });
    }
  }



  acceptTerms() {
    this.httpService.markFormGroupTouched(this.termForm);


    if (this.termForm.value.approve) {
      this.changeToStep(4);

    } else {
      this.notifyService.addToast({ title: "خطأ", msg: 'يرجى الموافقة على الشروط اﻷحكام', timeout: 10000, theme: '', position: 'top-center', type: 'error' });
    }
  }


  changeToStep(stepNumber) {

    switch (stepNumber) {
      case 1:
        this.stepOne = true;
        this.stepTwo = false;
        this.stepThree = false;
        this.stepFour = false;
        this.stepFive = false;
        break;
      case 2:
        this.stepOne = false;
        this.stepTwo = true;
        this.stepThree = false;
        this.stepFour = false;
        this.stepFive = false;
        break;
      case 3:
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = true;
        this.stepFour = false;
        this.stepFive = false;
        break;
      case 4:
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = false;
        this.stepFour = true;
        this.stepFive = false;
        break;
      case 5:
        this.stepOne = false;
        this.stepTwo = false;
        this.stepThree = false;
        this.stepFour = false;
        this.stepFive = true;
        break;
    }
  }


  async uploadAttachment(file,controleName){
    console.log('fileL: ',file);

    let formData = new FormData(); 

    formData.append("file",file[0]);

    let request = {
      method: "POST",
      path: "file/upload",
      body: formData
    };

    let response = await this.httpService.httpRequest(request);
    if (response.status == 200) {
      this.requestForm.get(controleName).setValue(response.data.url)
    }
  }


}
