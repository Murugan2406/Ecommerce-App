/* eslint-disable max-lines */
/* eslint-disable complexity */
/* eslint-disable dot-notation */
import {Component, HostListener, OnInit, ViewChild, } from '@angular/core';
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
import { specialProducts, sizeArray, options } from '../../../shared/specialProducts';
import { queryString } from '../../../shared/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-offer-sales',
  templateUrl: './offer-sales.component.html',
  styleUrls: [ './offer-sales.component.scss', '../list-product/list-product.component.scss' ]
})
export class OfferSalesComponent implements OnInit {

  form: FormGroup;

  subCategoryName?: string;

  sizeValue:string[] = [];

  brandValue:string[] = [];

  colorValue:string[] = [];


  sectionTitle = '';

  sectionSubtitle = '';

  currencyType = 'USD';

  nonAvailableProducts = false;

  loading = false;

  totalItems = 0;

  panelOpenState = false;

  isFirst = true;

  linkFrom = '';

  searchValue:string;

  products: specialProducts[] = [];

  filterProducts:specialProducts[] = [];

  sortingArray: specialProducts[] = [];

  brandList: specialProducts[] = [];

  sizeList:sizeArray[] = [];

  colorList:options[] = [];

  subsubId = 0;

  pageSize:number;

  screenSize:number;

  timeOutDuration:number;

  data:any[] = [ {product: 1} ];

  dataSource: MatTableDataSource<any>;

  dataSource$: any;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;


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

    this.searchValue = '';

    this.timeOutDuration = 1000;

    this.form = this.fb.group({
      startprice: new FormControl(null, [ Validators.required ]),
      endprice: new FormControl(null, [ Validators.required ]),
    });
    this.dataSource = new MatTableDataSource(this.products);

  }

  // eslint-disable-next-line class-methods-use-this
  @HostListener('window:scroll', [ '$event' ])onScroll() {

    AOS.init({disable: 'mobile'});

  }

  @HostListener('window:load', [ '$event' ])
  onLoad() {

    if (window.innerWidth <= this.screenSize) {

      this.isFirst = false;

    } else {

      this.isFirst = true;
      this.pageSize = 12;

    }

  }

  @HostListener('window:resize', [ '$event' ])
  onResize() {

    if (window.innerWidth <= this.screenSize) {

      this.isFirst = false;
      // Mobile view

    } else {

      this.isFirst = true;
      this.pageSize = 12;

    }

  }

  canFilter = false;

  canSort = false;

  canPaginate = false;

  pagIndex = 0;

  sortingValue = '';

  ngOnInit(): void {

    this.onLoad();

    this.products = [];

    this.currencyChanges();

    this.activatedRoute.queryParams.subscribe((params) => {

      this.bindQuaryValues(params);
      this.linkFrom = params['from'];
      this.searchValue = params['value'];

      this.getCorrectSection(this.linkFrom);

    });

  }


  // eslint-disable-next-line max-statements
  bindQuaryValues(params:any) {

    console.log(params);
    let brand = [];
    let color = [];
    let size = [];

    if (typeof params['brand'] === 'string') {

      brand = params['brand'].split(' ');


    } else {

      brand = params['brand'] ? params['brand'] : [];

    }

    if (typeof params['color'] === 'string') {

      color = params['color'].split(' ');


    } else {

      color = params['color'] ? params['color'] : [];

    }
    if (typeof params['size'] === 'string') {

      size = params['size'].split(' ');

    } else {

      size = params['size'] ? params['size'] : [];

    }


    this.brandValue = brand ? brand : [];
    this.colorValue = color ? color : [];
    this.sizeValue = size ? size : [];
    this.form.get('startprice')?.setValue(params['minPrice'] ? params['minPrice'] : null);
    this.form.get('endprice')?.setValue(params['maxPrice'] ? params['maxPrice'] : null);

    if (params['brand'] || params['color'] || params['size'] || params['minPrice'] || params['maxPrice']) {

      this.canFilter = true;

    } else {

      this.canFilter = false;

    }
    if (params['sortBy']) {

      this.canSort = true;

      this.sortingValue = params['sortBy'];

    } else {

      this.canSort = false;

    }
    if (params['pageIndex']) {

      this.canPaginate = true;

      this.pagIndex = Number.parseInt(params['pageIndex'], 10);


    } else {

      this.canPaginate = false;
      this.pagIndex = 0;

    }

  }

  getCorrectSection(linkFrom:string) {

    if (this.linkFrom === 'searchResult') {

      this.sectionTitle = 'Search Result';

      this.getDataforSearch(this.searchValue);

    } else if (linkFrom === 'offerSales') {

      this.sectionTitle = 'Offer Sales';

      this.getDataforOffersales();

    } else if (linkFrom === 'newArrivals') {

      this.sectionTitle = 'New Arrivals';

      this.getDataforNewArraivals();

    } else if (linkFrom === 'bagsTrends') {

      this.sectionTitle = 'Trending Bags';

      this.getDataforTrendingProducts();

    }

  }


  getDataforSearch(searchValue:string) {

    this.headerService.getSearchResult(searchValue).subscribe((data) => {

      this.setDefaultdatas(data);

    });

  }

  getDataforOffersales() {

    this.dashboardService.getOfferSales().subscribe((data) => {

      this.setDefaultdatas(data);

    });

  }


  getDataforNewArraivals() {

    this.dashboardService.getNewArrivals().subscribe((data) => {

      this.setDefaultdatas(data);

    });

  }

  getDataforTrendingProducts() {

    this.dashboardService.getBottomProducts().subscribe((data) => {

      this.setDefaultdatas(data);


    });

  }

  setDefaultdatas(data:any) {

    this.brandList = data['availablebrands'];

    this.sizeList = data['availableSizes'];

    this.colorList = data['availabeColours'];

    this.products = data['products'];

    this.filterProducts = data['products'];
    this.updateValueChanges(this.products);
    if (this.canFilter) {

      this.filterSection();

    }
    if (this.canSort) {

      this.changeSorting(this.sortingValue);

    }

  }

  currencyChanges() {

    if (localStorage.getItem(CURRENCY_TYPE)) {

      const cValue = localStorage.getItem(CURRENCY_TYPE);

      if (cValue) {

        this.currencyType = cValue;

      }

    } else {

      this.currencyType = 'EUR';

    }

  }

  updateSortingUrl(value: string) {

    this.router.navigate([], { queryParams: {sortBy: value, },
      queryParamsHandling: 'merge'});

  }


  changeSorting(value: string): void {

    this.sortingArray = [ ...this.dataSource.data ];

    switch (value) {

    case 'rating':
      // This.sortingArray.sort((firsyArray, secondArray) => firsyArray.rating - secondArray.rating);
      break;
    case 'LowToHigh':
      this.filterLtoH();
      break;
    case 'HighToLow':
      this.filterHtoL();
      break;
    case 'latest':
      this.sortingArray.sort((firsyArray, secondArray) =>
        new Date(secondArray.created_date).getTime() -
            new Date(firsyArray.created_date).getTime()
      );
      break;

    default:
      this.filterLtoH();
      break;

    }

    this.updateValueChanges(this.sortingArray);


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

    this.form.get('startprice')?.setValue(null);
    this.form.get('endprice')?.setValue(null);


    this.updateValueChanges(this.filterProducts);

  }


  alreadyAdded() {


    this._snackBar.open('Product already added in wishlist!', '', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    setTimeout(() => {

      this._snackBar.dismiss();

    }, this.timeOutDuration);


  }

  addtoWishlist(id: number) {

    this.data[0].product = id;
    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      localStorage.getItem(ACCESS_TOKEN_ID);

      this.updateWishlist(this.data[0]);


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


        element['options'].forEach((ele: { [x: string]: string[]; }) => {


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

    let PRArray:specialProducts[] = [ ...this.filterProducts ];
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

  updateFilterURl() {

    const minPrice = this.form.get('startprice')?.value;
    const maxPrice = this.form.get('endprice')?.value;

    this.router.navigate([], { queryParams: {brand: this.brandValue,
      size: this.sizeValue,
      color: this.colorValue,
      minPrice,
      maxPrice},
    queryParamsHandling: 'merge'});

  }


  filterSection() {


    // For brand Filter

    let brandResult:specialProducts[] = [];
    const brandFilter = [ ...this.filterProducts ];

    if (this.brandValue.length > 0) {

      brandResult = this.updateBrand(brandFilter);


    } else {

      brandResult = this.filterProducts;

    }


    let colorResult:specialProducts[] = [];
    const colorFilter = [ ...this.filterProducts ];

    if (this.colorValue.length > 0) {


      colorResult = this.updateColor(colorFilter);

    } else {

      colorResult = this.filterProducts;

    }


    // For size Filter

    let sizeResult:specialProducts[] = [];

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

  // eslint-disable-next-line class-methods-use-this
  onPaginateChange(event:any) {

    const Index = JSON.stringify(`Current page index: ${event.pageIndex}`);

    this.router.navigate([], { queryParams: {pageIndex: Index, },
      queryParamsHandling: 'merge'});

  }

  wishlistArray:any[] = [];


  updateValueChanges(products:specialProducts[]) {

    this.dataSource = new MatTableDataSource(products);
    this.dataSource$ = this.dataSource.connect();
    this.dataSource.paginator = this.paginator;

    if (this.canPaginate) {

      this.paginator.pageIndex = 0;

    }

    if (this.dataSource.data.length === 0) {

      this.nonAvailableProducts = true;

    } else {

      this.nonAvailableProducts = false;

    }

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      this.productService.getWishlist(localStorage.getItem(ACCESS_TOKEN_ID)).subscribe((data: any) => {


        data.forEach((element: { [x: string]: any; }) => {

          this.wishlistArray.push(element['product']);


        });

      });

    }

  }

  array:any[] = [];


}
