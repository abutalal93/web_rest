import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Component,OnInit } from '@angular/core';
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

  constructor(public authService: AuthService, private httpService: HttpService, private ref: ChangeDetectorRef) {
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
    let user: User = this.authService.getLoggedInUser();
    if(user == undefined){
      await this.httpService.refreshToken();
      user = this.authService.getLoggedInUser();
      console.log("user: ",user);
    }

    if(user.roleId == 'WAITRESS'){
      this.navItems = waitressItems;
    }
    

  }
}
