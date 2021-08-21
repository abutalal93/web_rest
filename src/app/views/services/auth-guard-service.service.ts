import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
       let url: string = state.url;

       this.authService.setLoginUrl('/login');

       if(this.cookieService.check('rest_user')){
         return true;
       }
       this.authService.setRedirectUrl(url);
       this.router.navigate([ this.authService.getLoginUrl() ]);
       this.cookieService.deleteAll();
       return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
      return true;
    }
}
