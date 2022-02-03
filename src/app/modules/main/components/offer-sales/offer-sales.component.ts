/* eslint-disable dot-notation */
import {Component, HostListener, OnInit, ViewChild, } from '@angular/core';
import { OwlOptions} from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as AOS from 'aos';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../../service/dashboard.service';
import { CURRENCY_TYPE, ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';
import { ProductService } from '../../../service/product.service';

import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from 'src/app/modules/service/header.service';
@Component({
  selector: 'app-offer-sales',
  templateUrl: './offer-sales.component.html',
  styleUrls: [ './offer-sales.component.scss', '../list-product/list-product.component.scss' ]
})
export class OfferSalesComponent implements OnInit {

  form: FormGroup;

  subCategoryName?: string;

  sizeValue:any[] = [];

  brandValue:any[] = [];

  colorValue:any[] = [];

  sizeTempArray:any[] = [];

  colorTempArray:any[] = [];

  brandTempArray:any[] = [];

  sectionTitle = '';

  sectionSubtitle = '';

  currencyType = 'USD';

  date: any = '';

  nonAvailableProducts = false;

  loading = false;

  totalItems = 0;

  panelOpenState = false;

  isFirst = true;

  dataSource: MatTableDataSource<any>;

  dataSource$: any;

  linkFrom = '';

  searchValue = '';

  filterCategory: any[] = [];

  mainCategory: any[] = [];

  products: any = [];


  fontStyleControl = new FormControl();


  filterProducts:any[] = [];

  sortingArray: any[] = [];

  brandList: any[] = [];

  sizeList:any[] = [];

  colorList:any[] = [];

  hparam: any;

  subsubId = 0;

  pageSize:number;

  screenSize:number;

  timeOutDuration:number;

  data:any[] = [ {product: 1} ];

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  offerOptions: OwlOptions = {
    loop: true,
    margin: 40,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    center: true,
    URLhashListener: false,
    startPosition: 'URLHash',
    navText: [
      '<i class=\'fa fa-long-arrow-left\'></i>',
      '<i class=\'fa fa-long-arrow-right\'></i>',
    ],

    responsive: {
      0: {
        items: 1,
        nav: true,
      },

      769: {
        items: 3,
        nav: true,
        loop: true,
        autoplay: false,
        margin: 40,
      },
    },

    nav: true,
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly _snackBar: MatSnackBar,
    private readonly router: Router,
    private dashboardService :DashboardService,
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly headerService: HeaderService,
  ) {

    this.pageSize = 9;
    this.screenSize = 768;

    this.timeOutDuration = 1000;

    this.form = this.fb.group({
      startprice: new FormControl(null, [ Validators.required ]),
      endprice: new FormControl(null, [ Validators.required ]),
    });
    this.dataSource = new MatTableDataSource(this.products);

  }

  // eslint-disable-next-line class-methods-use-this
  @HostListener('window:scroll', [ '$event' ])onScroll(_event: any) {

    AOS.init({disable: 'mobile'});

  }

  @HostListener('window:load', [ '$event' ])
  onLoad(event: any) {

    if (window.innerWidth <= this.screenSize) {

      this.isFirst = false;

    } else {

      this.isFirst = true;
      this.pageSize = 12;

    }

  }

  @HostListener('window:resize', [ '$event' ])
  onResize(event: any) {

    if (window.innerWidth <= this.screenSize) {

      this.isFirst = false;
      // Mobile view

    } else {

      this.isFirst = true;
      this.pageSize = 12;

    }

  }


  ngOnInit(): void {

    this.onLoad(event);

    this.products = [];

    this.currencyChanges();

    this.activatedRoute.queryParams.subscribe((params) => {


      this.linkFrom = params['from'];
      this.searchValue = params['value'];

      if (this.linkFrom === 'searchResult') {

        this.sectionTitle = 'Search Result';

        this.getDataforSearch(this.searchValue);

      } else if (this.linkFrom === 'offerSales') {

        this.sectionTitle = 'Offer Sales';

        this.getDataforOffersales();

      } else if (this.linkFrom === 'newArrivals') {

        this.sectionTitle = 'New Arrivals';

        this.getDataforNewArraivals();

      } else if (this.linkFrom === 'bagsTrends') {

        this.sectionTitle = 'Trending Bags';

        this.getDataforTrendingProducts();

      }

    });


  }


  getDataforSearch(searchValue:string) {

    this.headerService.getSearchResult(searchValue).subscribe((result: any) => {


      this.brandList = result['availablebrands'];

      this.sizeList = result['availableSizes'];

      this.colorList = result['availabeColours'];

      this.products = result['products'];

      this.filterProducts = result['products'];
      this.dataSourceUpdation(this.products);


    });

  }


  getDataforOffersales() {

    this.dashboardService.getOfferSales().subscribe((data: any) => {


      this.brandList = data['availablebrands'];

      this.sizeList = data['availableSizes'];

      this.colorList = data['availabeColours'];

      this.products = data['products'];

      this.filterProducts = data['products'];


      this.dataSourceUpdation(this.products);

    });

  }


  getDataforNewArraivals() {

    this.dashboardService.getNewArrivals().subscribe((data: any) => {


      this.brandList = data['availablebrands'];

      this.sizeList = data['availableSizes'];

      this.colorList = data['availabeColours'];

      this.products = data['products'];

      this.filterProducts = data['products'];

      this.dataSourceUpdation(this.products);

    });

  }


  getDataforTrendingProducts() {

    this.dashboardService.getBottomProducts().subscribe((data: any) => {


      data.forEach((element: { [x: string]: any; }) => {

        this.products.push(element['product']);

      });
      this.dataSourceUpdation(this.products);


    });

  }

  dataSourceUpdation(products: any[]) {

    this.dataSource = new MatTableDataSource(products);
    this.dataSource$ = this.dataSource.connect();
    this.dataSource.paginator = this.paginator;

  }

  currencyChanges() {

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


  changeSorting(value: string): void {

    this.sortingArray = [ ...this.dataSource.data ];

    switch (value) {

    case 'rating':
      this.sortingArray.sort((firsyArray: any, secondArray: any) => firsyArray.rating - secondArray.rating);
      break;
    case 'LowToHigh':
      this.filterLtoH();
      break;
    case 'HighToLow':
      this.filterHtoL();
      break;
    case 'latest':
      this.sortingArray.sort((firsyArray: any, secondArray: any) =>
        new Date(secondArray.created_date).getTime() -
            new Date(firsyArray.created_date).getTime()
      );
      break;

    }

    this.dataSource.data = this.sortingArray;
    this.dataSource$ = this.dataSource.connect();

  }


  filterLtoH() {

    if (localStorage.getItem(CURRENCY_TYPE) === 'EUR') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => firsyArray.OfferEuro - secondArray.OfferEuro);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'USD') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => firsyArray.OfferDollar - secondArray.OfferDollar);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'SAR') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => firsyArray.OfferSAR - secondArray.OfferSAR);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'GBP') {

      // eslint-disable-next-line max-len
      this.sortingArray.sort((firsyArray: any, secondArray: any) => firsyArray.OfferSterling - secondArray.OfferSterling);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'AED') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => firsyArray.OfferDirham - secondArray.OfferDirham);

    }

  }

  filterHtoL() {

    if (localStorage.getItem(CURRENCY_TYPE) === 'EUR') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => secondArray.OfferEuro - firsyArray.OfferEuro);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'USD') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => secondArray.OfferDollar - firsyArray.OfferDollar);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'SAR') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => secondArray.OfferSAR - firsyArray.OfferSAR);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'GBP') {

      // eslint-disable-next-line max-len
      this.sortingArray.sort((firsyArray: any, secondArray: any) => secondArray.OfferSterling - firsyArray.OfferSterling);

    }
    if (localStorage.getItem(CURRENCY_TYPE) === 'AED') {

      this.sortingArray.sort((firsyArray: any, secondArray: any) => secondArray.OfferDirham - firsyArray.OfferDirham);

    }

  }

  resetFilter(): void {

    this.sizeValue = [];
    this.brandValue = [];
    this.colorValue = [];

    this.updateValueChanges(this.filterProducts);

  }

  addtoWishlist(id: number) {

    this.data[0].product = id;
    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      localStorage.getItem(ACCESS_TOKEN_ID);

      const wishArray:any[] = [];

      let exist = false;

      this.productService.getWishlist(localStorage.getItem(ACCESS_TOKEN_ID)).subscribe((data: any) => {


        if (data.length === 0) {

          this.updateWishlist(this.data[0]);

        } else {

          data.forEach((element:any) => {

            wishArray.push(element['product']);

          });

          wishArray.forEach((element) => {

            if (element['id'] === this.data[0]['product']) {

              exist = true;

            }

          });

          if (exist) {

            this._snackBar.open('Product already added in wishlist!', '', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            setTimeout(() => {

              this._snackBar.dismiss();

            }, this.timeOutDuration);

          } else {

            this.updateWishlist(this.data[0]);

          }

        }

      });


    } else {

      this._snackBar.open('you need to login before adding wishlist!', '', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      setTimeout(() => {

        this._snackBar.dismiss();

      }, this.timeOutDuration);

    }

  }


  updateWishlist(dataId:number) {


    this.productService.addWishList(dataId).subscribe((data) => {

      this._snackBar.open('1 item added to favourite list !', '', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      setTimeout(() => {

        this._snackBar.dismiss();

      }, this.timeOutDuration);

    });

  }


  updateSize(question$:any) {

    const tempArray:any[] = [];

    question$.forEach((element: { [x: string]: any }) => {


      if (element['options'].length > 0) {


        element['options'].forEach((ele: any) => {


          if (ele['sizes']) {

            ele['sizes'].forEach((xyz:any) => {


              this.sizeValue.forEach((size: any) => {

                if (size === xyz['size']) {

                  tempArray.push(element);

                }

              });

            });

          }


        });

      }

    });

    const ids = tempArray.map((ooo) => ooo.id);
    const filtered = tempArray.filter(({id}, index) => !ids.includes(id, index + 1));

    return filtered;

  }


  updateColor(question$:any) {

    const tempArray:any[] = [];

    question$.forEach((element: { [x: string]: any }) => {


      if (element['options'].length > 0) {

        element['options'].forEach((ele: any) => {


          if (ele['color']) {

            this.colorValue.forEach((color: any) => {

              if (color === ele['color']) {

                tempArray.push(element);

              }

            });

          }


        });

      }

    });

    const ids = tempArray.map((ooo) => ooo.id);
    const filtered = tempArray.filter(({id}, index) => !ids.includes(id, index + 1));

    return filtered;


  }


  updateBrand(sizeFilter:any) {


    const tempArray:any[] = [];


    sizeFilter.forEach((element:any) => {

      if (element['brand']) {

        this.brandValue.forEach((brand: any) => {

          if (brand === element['brand'].name) {

            tempArray.push(element);

          }

        });

      }

    });

    const ids = tempArray.map((ooo) => ooo.id);
    const filtered = tempArray.filter(({id}, index) => !ids.includes(id, index + 1));

    return filtered;


  }


  submit() {

    const minPrice = this.form.get('startprice')?.value;
    const maxPrice = this.form.get('endprice')?.value;

    let PRArray:any[] = [ ...this.filterProducts ];
    if (this.form.valid) {

      if (localStorage.getItem(CURRENCY_TYPE) === 'EUR') {

        PRArray = PRArray.filter((prod) => prod.OfferEuro >= minPrice && prod.OfferEuro <= maxPrice);

        return PRArray;


      }
      if (localStorage.getItem(CURRENCY_TYPE) === 'USD') {

        PRArray = PRArray.filter((prod) => prod.OfferDollar >= minPrice && prod.OfferDollar <= maxPrice);

        return PRArray;


      }
      if (localStorage.getItem(CURRENCY_TYPE) === 'SAR') {

        PRArray = PRArray.filter((prod) => prod.OfferSAR >= minPrice && prod.OfferSAR <= maxPrice);

        return PRArray;


      }
      if (localStorage.getItem(CURRENCY_TYPE) === 'GBP') {

        PRArray = PRArray.filter((prod) => prod.OfferSterling >= minPrice && prod.OfferSterling <= maxPrice);

        return PRArray;

      }
      if (localStorage.getItem(CURRENCY_TYPE) === 'AED') {

        PRArray = PRArray.filter((prod) => prod.OfferDirham >= minPrice && prod.OfferDirham <= maxPrice);

        return PRArray;


      }


    }

    return PRArray;


  }


  filterSection() {


    // For brand Filter


    let brandResult:any[] = [];
    const brandFilter = [ ...this.filterProducts ];

    if (this.brandValue.length > 0) {

      brandResult = this.updateBrand(brandFilter);


    } else {

      brandResult = this.filterProducts;

    }


    let colorResult:any[] = [];
    const colorFilter = [ ...this.filterProducts ];

    if (this.colorValue.length > 0) {


      colorResult = this.updateColor(colorFilter);

    } else {

      colorResult = this.filterProducts;

    }


    // For size Filter

    let sizeResult:any[] = [];

    const sizeFilter = [ ...this.filterProducts ];


    if (this.sizeValue.length > 0) {

      sizeResult = this.updateSize(sizeFilter);

    } else {

      sizeResult = this.filterProducts;

    }


    // For price Filter

    let priceResult:any[] = [];

    priceResult = this.submit();

    this.getResultendArray(brandResult, colorResult, sizeResult, priceResult);


  }


  getResultendArray(brandResult:any[], colorResult:any[], sizeResult:any[], priceResult:any[]) {

    const result1 = brandResult.filter((obj1) => colorResult.some((obj2) =>

      obj1.id === obj2.id

    ));

    const result2 = result1.filter((obj1) => sizeResult.some((obj2) =>

      obj1.id === obj2.id

    ));

    const result3 = result2.filter((obj1) => priceResult.some((obj2) =>

      obj1.id === obj2.id

    ));


    this.updateValueChanges(result3);


  }


  updateValueChanges(products:any) {

    this.dataSource = new MatTableDataSource(products);
    this.dataSource$ = this.dataSource.connect();
    this.dataSource.paginator = this.paginator;
    if (this.dataSource.data.length === 0) {

      this.nonAvailableProducts = true;

    } else {

      this.nonAvailableProducts = false;

    }

  }


}
