import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { OrdersComponent } from './orders/orders.component';
import { SettingsComponent } from './settings.component';
import { WishlistComponent } from './wishlist/wishlist.component';
const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'myaccount',
        component: AccountComponent,

      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'myaccount',
      },
      {
        path: 'wishlist',
        component: WishlistComponent,

      },
      {
        path: 'orders',
        component: OrdersComponent,

      },
    ]
  }

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule { }
