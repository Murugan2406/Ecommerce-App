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

  subtasks: any[] = [
    { name: 'Oppo',
      completed: false },
    { name: 'Vivo',
      completed: false },
    { name: 'Realme',
      completed: false },
  ];

  size: any[] = [
    { name: 'one size ',
      completed: false },
    { name: 'S',
      completed: false },
    { name: 'M',
      completed: false },
    { name: 'L',
      completed: false },
    { name: 'XL',
      completed: false },
    { name: 'XXL',
      completed: false },
    { name: 'XXXl',
      completed: false },
  ];

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

      console.log(params);


      this.linkFrom = params['from'];
      this.searchValue = params['value'];

      if (this.linkFrom === 'searchResult') {

        this.headerService.getSearchResult(this.searchValue).subscribe((result: any) => {

          console.log(result);


          this.products = result['products'];
          this.dataSource = new MatTableDataSource(this.products);
          this.dataSource$ = this.dataSource.connect();
          this.dataSource.paginator = this.paginator;


        });

      } else {


        this.dashboardService.getOfferSales().subscribe((data: any) => {

          console.log(data);


          this.products = data;
          this.dataSource = new MatTableDataSource(this.products);
          this.dataSource$ = this.dataSource.connect();
          this.dataSource.paginator = this.paginator;

        });

      }

    });


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
    default:
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

    question$.forEach((element: { [x: string]: any }) => {

      if (element['options'].length > 0) {

        const questionS = element['options'];
        questionS.forEach((data: { [x: string]: any }) => {

          if (data['sizes'].length > 0) {

            const xyz = data['sizes'];
            xyz.forEach((ele: { [x: string]: any }) => {

              if (paramss === ele['size']) {

                question.push(element);

              } else {

              }

            });

          } else {

          }

        });


      } else {

      }

    });
    this.updateValueChanges(question);

  }

  filterbycolor(param: string) {

    const params = param.toLowerCase();
    const question: any = [];
    const question$ = [ ...this.products ];
    question$.forEach((element: { [x: string]: any }) => {

      if (element['options'].length > 0) {

        const questionS = element['options'];
        questionS.forEach((data: { [x: string]: any }) => {

          if (params === data['color']) {

            question.push(element);

          }

        });

      } else {

      }

    });

    this.updateValueChanges(question);

  }


  filterbyBrand(params: string) {

    const paramss = params.toLowerCase();
    const question: any = [];
    const question$ = [ ...this.products ];

    question$.forEach((element: { [x: string]: any }) => {

      if (element['brand']) {

        if (element['brand'].name === paramss) {

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
