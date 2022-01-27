import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MainComponent } from './main.component';
import { UserInfoComponent } from './common/user-info/user-info.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { PreviewProductComponent } from './components/preview-product/preview-product.component';
import { OfferSalesComponent } from './components/offer-sales/offer-sales.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'listProduct/:id/:product',
        component: ListProductComponent,
      },
      {
        path: 'previewProduct/:id',
        component: PreviewProductComponent,
      },
      {
        path: 'userinfo',
        component: UserInfoComponent,
      },
      {
        path: 'offersales',
        component: OfferSalesComponent,
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then((mod) => mod.SettingsModule)
      },
    ]
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MainRoutingModule { }
