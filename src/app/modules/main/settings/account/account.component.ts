import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
import { UserService } from '../../../service/user.service';
import { ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';
import { findColumnValue as _findColumnValue } from '../../../utils/classmethod.util';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: [ './account.component.scss' ]
})
export class AccountComponent implements OnInit {

  displayedColumns: string[] = [ 'firstName', 'lastName', 'email', 'phone' ];

  displayedAddress: string[] = [ 'country', 'city', 'address', 'pincode' ];

  dataSource:any[] = [];

 @Input() columnHeaders: Record<string, string>;

 @Input() columnAddress: Record<string, string>;

 constructor(public readonly router: Router,
    public readonly userService: UserService,) {

   this.columnHeaders = {
     firstName: 'First name',
     lastName: 'Last name',
     email: 'e-mail Id',
     phone: 'Phone number',
   };
   this.columnAddress = {
     country: 'Country Name',
     city: 'City name',
     address: 'Address',
     pincode: 'ZIP Code',
   };

 }


   // eslint-disable-next-line class-methods-use-this
   @HostListener('window:scroll', [ '$event' ]) onScroll(event: any) {

   AOS.init({disable: 'mobile'});

 }

   ngOnInit(): void {

     if (localStorage.getItem(ACCESS_TOKEN_ID)) {

       this.userService.getUserData().subscribe((data: any) => {

         this.dataSource = data[0].address;

       });

     }

   }

   findColumnValue = _findColumnValue;

   navigateToInfo():void {

     this.router.navigate([ '/userinfo' ]);

   }

}
