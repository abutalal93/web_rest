import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers} from '@angular/http';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth-service.service';
import { FormGroup } from '@angular/forms';
import { User } from '../model/user';

@Injectable()
export class HttpService {
  private apiUrl = environment.apiUrl;

  private headers: Headers = new Headers();
  private options: RequestOptions = new RequestOptions();
  private path;
  private prefix = environment.prefix;

  constructor(private cookieService: CookieService, private http: Http,private authService: AuthService) {
  }

   async httpRequest(request_options:any): Promise<any>{

    if(this.cookieService.check('rest_user')){
      this.headers.set('Authorization','Bearer ' + this.cookieService.get('rest_user'));
    }
  
    this.options.headers = this.headers;
    this.options.method = request_options.method;
    if(request_options.body){
      this.options.body = request_options.body;
    }
    if(request_options.prefix){
      this.prefix = request_options.prefix;
    }
    this.path = request_options.path ;
    let http_response = await this.http.request(this.apiUrl + this.prefix + this.path,  this.options)
    .toPromise()
    .then(response => response.json())
    .catch((err: any) => {
      let response: any;
      switch(err.status){
        case 401:
          response = { status: err.status , message: 'Invalid username or password'}
          this.authService.logoutUser();
          break;
        case 500:
          response = { status: err.status , message: 'Internal Server Error'}
          break;
        default:
          response = err.json();
          break;
        }

      return response;
    });

    return http_response;


  }

  async httpFile(request_options:any): Promise<any>{

    let headers: Headers = new Headers();

    headers.set('Content-Type','multipart/form-data');
    headers.set('Accept', "multipart/form-data");
  
    this.options.headers = headers;
    this.options.method = request_options.method;
    if(request_options.body){
      this.options.body = request_options.body;
    }
    if(request_options.prefix){
      this.prefix = request_options.prefix;
    }
    this.path = request_options.path ;
    let http_response = await this.http.request(this.apiUrl + this.prefix + this.path,  this.options)
    .toPromise()
    .then(response => response.json())
    .catch((err: any) => {
      let response: any;
      switch(err.status){
        case 401:
          response = err.json();
          this.authService.logoutUser();
          break;
        case 500:
          response = { status: err.status , message_key: err.statusText}
          break;
        default:
          response = err.json();
          break;
        }

      return response;
    });

    return http_response;


  }

  async refreshToken(): Promise<any>{

    if(this.cookieService.check('rest_user')){
      this.headers.set('Authorization','Bearer ' + this.cookieService.get('rest_user'));
    }
  
    this.options.headers = this.headers;
    this.options.method = "GET";
    this.path = "rest/user/refresh" ;
    let http_response = await this.http.request(this.apiUrl + this.prefix + this.path,  this.options)
    .toPromise()
    .then(response => response.json())
    .catch((err: any) => {
      let response: any;
      switch(err.status){
        case 401:
          response = { status: err.status , message: 'Invalid username or password'}
          this.authService.logoutUser();
          break;
        case 500:
          response = { status: err.status , message: 'Internal Server Error'}
          break;
        default:
          response = err.json();
          break;
        }

      return response;
    });

    this.authService.setIsUserLoggedIn(true);
    const user = new User(http_response.data.id, http_response.data.token, http_response.data.firstName + " " +http_response.data.lastName,http_response.data.username, http_response.data.avatar);
    this.authService.setLoggedInUser(user);

    return http_response;
  }

  markFormGroupTouched(form: FormGroup) {
    (<any>Object).values(form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

}
