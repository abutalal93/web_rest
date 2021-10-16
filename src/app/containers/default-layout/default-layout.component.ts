import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component,OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../../views/model/user';
import { AuthService } from '../../views/services/auth-service.service';
import { HttpService } from '../../views/services/http.service';
import { navItems } from '../../_nav';
import { waitressItems } from '../../_waitress';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  user = {
    userId: null,
    token: null,
    username: null,
    name: null,
    avatar: null,
    roleId: null,
  };

  constructor(public authService: AuthService, private httpService: HttpService, private ref: ChangeDetectorRef, private cookieService: CookieService) {
    console.log("DefaultLayoutComponent: ");
    setInterval(() => {
      this.ref.markForCheck();
    }, 1000);
  }

  logout(){
    this.authService.logoutUser();
  }

 async ngOnInit() {
  console.log("ngOnInit DefaultLayoutComponent: ")
    this.user = this.authService.getLoggedInUser();
    if(this.user == undefined){
      this.user = JSON.parse(this.cookieService.get('user'))
    }

    if(this.user.roleId == 'WAITRESS'){
      this.navItems = waitressItems;
    }
    

  }
}
