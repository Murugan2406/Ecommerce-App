import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { UserInfoComponent } from './common/user-info/user-info.component';
import {MatDividerModule} from '@angular/material/divider';
import { LogoutComponent } from './common/logout/logout.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CartComponent } from './common/cart/cart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { PreviewProductComponent } from './components/preview-product/preview-product.component';
import { OfferSalesComponent } from './components/offer-sales/offer-sales.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    UserInfoComponent,
    LogoutComponent,
    CartComponent,
    DashboardComponent,
    ListProductComponent,
    PreviewProductComponent,
    OfferSalesComponent,
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    CommonModule,
    MainRoutingModule, MatDividerModule, MatToolbarModule, MatFormFieldModule, MatInputModule,
    ReactiveFormsModule, FormsModule, MatSelectModule, MatButtonToggleModule, MatIconModule,
    MatBadgeModule, MatSidenavModule, MatDialogModule, MatRippleModule, MatPaginatorModule, MatSnackBarModule,
    MatButtonModule, CarouselModule, MatGridListModule, MatExpansionModule, MatTabsModule, MatCardModule,
    NgxSkeletonLoaderModule, MatCheckboxModule
  ]
})
export class MainModule { }
