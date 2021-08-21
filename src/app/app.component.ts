import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { HttpService } from './views/services/http.service';
import { AuthService } from './views/services/auth-service.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: ' <ngx-loading-bar></ngx-loading-bar><ng2-toasty [position]="position"></ng2-toasty><router-outlet></router-outlet>',
  providers: [IconSetService],
})
export class AppComponent implements OnInit {

  position = 'top-center';

  constructor(
    private router: Router,
    public iconSet: IconSetService,
    private httpService: HttpService,
    private cookieService: CookieService
  ) {
    // iconSet singleton
    iconSet.icons = { ...freeSet };
  }

  async ngOnInit() {

    if(this.cookieService.check('rest_user')){
      await this.httpService.refreshToken();
    }

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }
}
