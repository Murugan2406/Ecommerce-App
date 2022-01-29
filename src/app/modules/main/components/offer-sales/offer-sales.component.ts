/* eslint-disable dot-notation */
import {Component, HostListener, OnInit, ViewChild, } from '@angular/core';
import { OwlOptions} from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
  styleUrls: [ './offer-sales.component.scss' ]
})
export class OfferSalesComponent implements OnInit {

  form: FormGroup;

  subCategoryName?: string;

  sizeValue?: string;

  brandValue?: string;

  colorValue?: string;

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


  filterProducts:any = [];

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
      startprice: new FormControl(0),
      endprice: new FormControl(0),
    });
    this.dataSource = new MatTableDataSource(this.products);

  }

  @HostListener('window:scroll', [ '$event' ])onScroll(event: any) {

    if (window.innerWidth >= this.screenSize) {

      AOS.init();

    }

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

    } else {

      this.isFirst = true;
      this.pageSize = 12;

    }

  }

  ngOnInit(): void {

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

    this.sizeValue = '';
    this.brandValue = '';
    this.dataSource.data = this.products;
    this.dataSource$ = this.dataSource.connect();

  }

  openSnackBar(id: number) {

    this.data[0].product = id;
    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      localStorage.getItem(ACCESS_TOKEN_ID);

      this.productService.addWishList(this.data[0]).subscribe((data) => {

        this._snackBar.open('1 item added to favourite list !', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        setTimeout(() => {

          this._snackBar.dismiss();

        }, this.timeOutDuration);

      });

    } else {

      this._snackBar.open('please login to add wishlist!', '', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      setTimeout(() => {

        this._snackBar.dismiss();

      }, this.timeOutDuration);

    }

  }

  productPreview(id: number): void {

    const link = [ 'previewProduct', id ];
    this.router.navigate(link);

  }


  filterbySize(params: string) {


    const paramss = params.toLowerCase();

    const question: any = [];
    const question$ = [ ...this.products ];
    let idx: any[] = [];

    question$.forEach((element: { [x: string]: any }) => {


      if (element['options'].length > 0) {

        const questionS = element['options'];


        questionS.forEach((data: { [x: string]: any }) => {


          if (data['sizes'].length > 0) {

            const xyz = data['sizes'];
            xyz.forEach((ele: { [x: string]: any }) => {

              if (paramss === ele['size']) {

                if (!idx.includes(element['id'])) {

                  question.push(element);

                }

                idx.push(element['id']);

              } else {

              }

            });

          } else {

          }

        });

        idx = idx.sort();


      }

    });
    this.updateValueChanges(question);

  }

  filterbycolor() {

    const question: any = [];
    const question$ = [ ...this.filterProducts ];


    question$.forEach((element: { [x: string]: any }) => {

      if (element['options'].length > 0) {

        element['options'].forEach((ele: any) => {

          question.push(ele);

        });

      }

    });


  }


  filterbyBrand(params: string) {

    const paramss = params.toLowerCase();
    const question: any = [];
    const question$ = [ ...this.products ];

    question$.forEach((element: { [x: string]: any }) => {

      if (element['brand']) {

        if (paramss === element['brand'].name.toLowerCase()) {

          question.push(element);

        }

      }

    });

    this.updateValueChanges(question);

  }

  submit() {

    const minimumPrice = this.form.get('startprice')?.value;
    const maximumPrice = this.form.get('endprice')?.value;
    this.sortingArray = [ ...this.dataSource.data ];
    this.sortingArray = this.sortingArray.filter((product) =>
      product.price >= minimumPrice && product.price <= maximumPrice);

    this.updateValueChanges(this.sortingArray);

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
