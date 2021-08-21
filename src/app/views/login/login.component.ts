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
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{ 


  loginForm: FormGroup;

  position = 'top-center';


  ngOnInit() {
      this.loadForm();
  }

  constructor( private router: Router, private authService: AuthService, private cookieService: CookieService, private httpService: HttpService, private notifyService: NotifyService) {
    
  }

  loadForm() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  async login(){
    this.httpService.markFormGroupTouched(this.loginForm);

    if (this.loginForm.valid) {

      let request = {
        method: "POST",
        path: "rest/user/login",
        body: this.loginForm.value
      };

      let response = await this.httpService.httpRequest(request);
      console.log(response);
      if(response.status == 200){

        this.authService.setIsUserLoggedIn(true);
        const user = new User(response.data.id, response.data.token, response.data.firstName + " " +response.data.lastName,response.data.username, response.data.avatar);
        this.authService.setLoggedInUser(user);
        this.cookieService.set('rest_user', response.data.token);
        let url = this.authService.getRedirectUrl();
        this.router.navigate([url]).then(() => {
        });

        this.notifyService.addToast({ title: "Success", msg: "Operation Done Successfully", timeout: 10000, theme: '', position: 'top-center', type: 'success' });
      }else{
        this.notifyService.addToast({ title: "Error", msg: response.message, timeout: 10000, theme: '', position: 'top-center', type: 'error' });
      }
    }
  }


}
