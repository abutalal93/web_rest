import {Component} from '@angular/core';
import { AuthService } from '../../views/services/auth-service.service';
import { HttpService } from '../../views/services/http.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  public sidebarMinimized = false;
  public navItems = navItems;

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

  constructor(public authService: AuthService) {
    
  }

  logout(){
    this.authService.logoutUser();
  }
}
