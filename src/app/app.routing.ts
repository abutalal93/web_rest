import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';
import { CompetitionComponent } from './views/competition/competition.component';
import { CustomerComponent } from './views/customer/customer.component';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { AuthGuardService } from './views/services/auth-guard-service.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'customer',
    component: CustomerComponent,
    data: {
      title: 'Customer Page'
    }
  },
  {
    path: 'competition',
    component: CompetitionComponent,
    data: {
      title: 'Competition Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'menu',
        loadChildren: () => import('./views/menu/menu.module').then(m => m.MenuModule)
      },
      {
        path: 'item',
        loadChildren: () => import('./views/item/item.module').then(m => m.ItemModule)
      },
      {
        path: 'qrs',
        loadChildren: () => import('./views/qrs/qrs.module').then(m => m.QrsModule)
      },
      {
        path: 'order',
        loadChildren: () => import('./views/order/order.module').then(m => m.OrderModule)
      },
      {
        path: 'discount',
        loadChildren: () => import('./views/discount/discount.module').then(m => m.DiscountModule)
      },
      {
        path: 'users',
        loadChildren: () => import('./views/user/user.module').then(m => m.UserModule)
      },
      {
        path: 'setting',
        loadChildren: () => import('./views/setting/setting.module').then(m => m.SettingModule)
      },
      {
        path: 'change-pass',
        loadChildren: () => import('./views/change-pass/change-pass.module').then(m => m.ChangePasswordModule)
      },
      {
        path: 'order-history',
        loadChildren: () => import('./views/order-history/order-history.module').then(m => m.OrderHistoryModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'table',
        loadChildren: () => import('./views/tabel/qrs.module').then(m => m.QrsModule)
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
