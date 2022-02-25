/* eslint-disable dot-notation */
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {DashboardService } from '../../../service/dashboard.service';
import { HttpClient } from '@angular/common/http';

import { HeaderService } from '../../../service/header.service';
import { Router } from '@angular/router';
import { CURRENCY_TYPE, VERIFY } from '../../../../../assets/API/server-api';
import { categories, } from '../../../shared/category';
import { specialProducts } from '../../../shared/specialProducts';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})
export class DashboardComponent implements OnInit {

  error = '';

  mainCategory:categories[] = [];

  offerSale:specialProducts[] = [];

  newArraivals:specialProducts[] = [];

  bagsTrends:specialProducts[] = [];

  name1 = '';

  name2 = '';

  name3 = '';

  category1 = '';

  category2 = '';

  category3 = '';

  hoverId = 0;


  ssName1 = '';

  ssName2 = '';

  ssName3 = '';

  id1 = 0;

  id2 = 0;

  id3 = 0;

  CategoryId = 0;

  currencyType = 'EUR';

  offerOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 400,
    center: true,
    nav: true,
    navText: [ '<i class=\'fa fa-long-arrow-left\'></i>', '<i class=\'fa fa-long-arrow-right\'></i>' ],
    responsive: {
      0: {
        items: 1,

      },
      769: {
        items: 3,
        margin: 40,

      },
      1000: {
        items: 3,

        loop: true,
        autoplay: false,
        margin: 40,
      }
    },

  };

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    center: true,
    navSpeed: 700,
    navText: [ '<i class=\'fa fa-long-arrow-left\'></i>', '<i class=\'fa fa-long-arrow-right\'></i>' ],
    responsive: {
      0: {
        items: 1,
      },
      769: {
        items: 3,
        margin: 40,

      },
      1000: {
        items: 3,
        loop: true,
        autoplay: false,
        margin: 40,
      }

    },
  };

  suggestionOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 200,
    autoplayHoverPause: false,
    margin: 40,
    nav: true,
    navText: [ '<i class=\'fa fa-long-arrow-left\'></i>', '<i class=\'fa fa-long-arrow-right\'></i>' ],

    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 4
      },
      1000: {
        items: 4,
        margin: 40,
        nav: true
      },
      1500: {
        items: 5,
        margin: 40,
        nav: true
      }
    },

  };

  contactForm:FormGroup = new FormGroup({
    Email: new FormControl('', [ Validators.required ]),
  });


  constructor(private http: HttpClient,
    private dashboardService :DashboardService,
    private readonly headerService:HeaderService,
    private readonly router: Router,
    private el: ElementRef,) {

  }

  ngOnInit(): void {

    this.headerService.getCategory().subscribe((data: categories[]) => {

      this.mainCategory = data;
      this.openSubCategories(this.mainCategory[0].subcategories, this.mainCategory[0].id);

    });
    this.dashboardService.getOfferSales().subscribe((data) => {

      this.offerSale = data['products'];

    });
    this.dashboardService.getNewArrivals().subscribe((data) => {

      this.newArraivals = data['products'];

    });
    this.dashboardService.getBottomProducts().subscribe((data) => {

      this.bagsTrends = data['products'];


    });


    if (localStorage.getItem(VERIFY)) {

      localStorage.removeItem(VERIFY);
      window.location.reload();

    }
    this.setCurrencyValue();


  }


  setCurrencyValue() {

    if (localStorage.getItem(CURRENCY_TYPE)) {

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

    } else {

      this.currencyType = 'EUR';

    }

  }

  submitContact():void {

    if (this.contactForm.valid === true) {

      if (!(/^(?<name>[a-zA-Z0-9_\-\.]+)@(?<domain>[a-zA-Z0-9_\-\.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.contactForm.value.Email)) {

        this.error = ' * please enter valid email address';

      } else {

        this.error = '';

      }

    } else {

      this.error = ' * please enter your email address';

    }

  }

  openSubCategories(data:specialProducts[], id:number) {

    console.log(data, id);
    this.hoverId = id;

    this.id1 = data[0].id;
    this.id2 = data[0].id;
    this.id3 = data[0].id;
    this.CategoryId = id;
    this.name1 = data[0].name;
    this.name2 = data[1].name;
    this.name3 = data[2].name;
    this.category1 = data[0].image.original;
    this.category2 = data[1].image.original;
    this.category3 = data[2].image.original;

  }


}
