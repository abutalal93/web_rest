import { BrowserModule } from '@angular/platform-browser';
import { Injectable, NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
import { CookieService } from 'ngx-cookie-service';
import { HttpService } from './views/services/http.service';
import { AuthService } from './views/services/auth-service.service';
import { AuthGuardService } from './views/services/auth-guard-service.service';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastyModule } from 'ng2-toasty';
import { NotifyService } from './views/services/notify.service';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { QRCodeModule } from 'angularx-qrcode';
import { CustomerComponent } from './views/customer/customer.component';
import { CompetitionComponent } from './views/competition/competition.component';
import { CustomValidationService } from './views/services/custom-validation-service.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SocketIoModule } from 'ngx-socket-io';
import { SocketioService } from './views/services/socket-one-service';
import { SocketTwo } from './views/services/socket-two-service';
import { DataFilterPipe } from './views/services/data-filter.pipe';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SocketIoModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    HttpModule,
    IconSetModule.forRoot(),
    ReactiveFormsModule,
    ToastyModule.forRoot(),
    LoadingBarHttpModule,
    QRCodeModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    CustomerComponent,
    CompetitionComponent,
    DataFilterPipe,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    SocketioService,
    AuthService,
    AuthGuardService,
    IconSetService,
    CookieService,
    HttpService,
    NotifyService,
    CustomValidationService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
