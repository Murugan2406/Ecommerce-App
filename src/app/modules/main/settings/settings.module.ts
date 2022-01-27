import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { AccountComponent } from './account/account.component';
import { OrdersComponent } from './orders/orders.component';
import { WishlistComponent } from './wishlist/wishlist.component';


import { MatIconModule } from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';


import {MatButtonModule} from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatRippleModule} from '@angular/material/core';
@NgModule({
  declarations: [
    SettingsComponent,
    AccountComponent,
    OrdersComponent,
    WishlistComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule, MatIconModule, MatTableModule, MatCardModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, ReactiveFormsModule, MatInputModule, FormsModule, MatToolbarModule, MatPaginatorModule,
    MatSnackBarModule, MatRippleModule
  ]
})
export class SettingsModule { }
