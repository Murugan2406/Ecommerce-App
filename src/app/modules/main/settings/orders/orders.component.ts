import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { UserService } from '../../../service/user.service';
import { CURRENCY_TYPE, ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';
import { MatDialog } from '@angular/material/dialog';
import { ReviewComponent } from '../../common/review/review.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: [ './orders.component.scss' ]
})
export class OrdersComponent implements OnInit {

  longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suscipit commodo, mauris, lectus volutpat. Neque porttitor molestie';

  currencyType = 'EUR';

  orders:any[] = [];

  emptyOrders = true;

  constructor(public readonly router: Router,
      public readonly userService: UserService,
      public dialog: MatDialog) { }

  // eslint-disable-next-line class-methods-use-this
 @HostListener('window:scroll', [ '$event' ]) onScroll(_event: any) {

    AOS.init({disable: 'mobile'});

  }

 ngOnInit(): void {


   if (localStorage.getItem(ACCESS_TOKEN_ID)) {

     this.userService.getOrders().subscribe((data: any) => {

       if (data.length === 0) {

         this.emptyOrders = true;

       } else {

         this.emptyOrders = false;


         this.orders = data;
         if (localStorage.getItem(CURRENCY_TYPE)) {

           this.setCurrencyValue();

         } else {

           this.currencyType = 'EUR';

         }

       }

     });

   }

 }


 setCurrencyValue() {

   const cValue = localStorage.getItem(CURRENCY_TYPE);
   switch (cValue) {

   case 'EUR': {

     this.currencyType = 'EUR';
     break;

   }
   case 'USD': {

     this.currencyType = 'USD';
     break;

   }
   case 'SAR': {

     this.currencyType = 'SAR';
     break;

   }
   case 'GBP': {

     this.currencyType = 'GBP';
     break;

   }
   case 'AED': {

     this.currencyType = 'AED';
     break;

   }

   }

 }

 navigateToHome():void {

   this.router.navigate([ '/' ]);

 }

 openReviewDialog(campaign:any) {

   const dialogRef = this.dialog.open(ReviewComponent, {
     data: {data: campaign,
       message: 'order'}
   });

 }


}
