/* eslint-disable dot-notation */
import {Component, HostListener, OnInit, ViewChild, } from '@angular/core';
import {OwlOptions, SlidesOutputData, } from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Router, } from '@angular/router';
import * as AOS from 'aos';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ListProductService } from '../../../service/list-product.service';
import { ProductService } from '../../../service/product.service';
import { CURRENCY_TYPE, ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';
@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: [ './list-product.component.scss' ],
})
export class ListProductComponent implements OnInit {

  form: FormGroup;

  sectionTitle = '';

  sectionSubtitle = '';

  subCategoryName?: string;

  sizeValue?: string;

  brandValue?: string;

  currencyType = 'EUR';

  date: any = '';

  nonAvailableProducts = false;

  loading = false;

  totalItems = 0;

  panelOpenState = false;

  isFirst = true;

  dataSource: MatTableDataSource<any>;

  dataSource$: any;

  filterCategory: any[] = [];

  mainCategory: any[] = [];

  products: any = [];

  sortingArray: any[] = [];

  hparam: any;

  subsubId = 0;

  pageSize:number;

  screenSize:number;

  timeOutDuration:number;

  @ViewChild(MatPaginator) paginator: MatPaginator | any;

  brandList: any[] = [];

  sizeList:any[] = [];

  colorList:any[] = [];

  susubroute = false;

  data:any[] = [ {product: 1} ];

  centervalueId = 0;

  isDragging = true;

  offerOptions: OwlOptions = {
    loop: true,
    margin: 40,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 500,
    center: true,
    lazyLoad: true,
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
    private readonly listBeautyService: ListProductService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly productService: ProductService,
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

  // eslint-disable-next-line class-methods-use-this
  @HostListener('window:scroll', [ '$event' ])onScroll(_event: any) {

    AOS.init();

  }

  @HostListener('window:load', [ '$event' ])
  onLoad(event: any) {

    if (window.innerWidth <= this.screenSize) {

      this.isFirst = false;


    } else {

      this.isFirst = true;

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

  checkid = 0;

  ngOnInit(): void {

    this.products = [];
    this.onLoad(event);
    this.activatedRoute.queryParams.subscribe((params) => {

      this.checkid = 1;
      this.hparam = params;
      this.subsubId = Number.parseInt(params['subsubId'], 10);
      this.setdefaultData(params['id']);

    });


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

  setdefaultData(id: number) {

    this.listBeautyService.getDataofMainCategory(id).subscribe((data) => {

      this.sectionTitle = data.name;
      this.mainCategory = data.subcategories;

    });

  }

  iinitialId = 0;

  indexId = 0;

  onIndexChange(data: SlidesOutputData) {

    this.loading = true;

    if (!data.slides) {

      return;

    }
    if (data.slides.length > 0) {

      if (this.isFirst === false) {

        const centerId = Number.parseInt(data.slides[0].id, 10);
        if (!centerId) {

          return;

        }
        this.getProductData(centerId, 'translated');

        return;

      } else if (this.isFirst === true) {

        const centerId = Number.parseInt(data.slides[1].id, 10);
        this.indexId = centerId;

        if (this.centervalueId === centerId) {

          return;

        }

        this.getProductData(centerId, 'translated');


      }

    }

    this.loading = false;

  }


  initialized(data: SlidesOutputData) {

    this.loading = true;
    if (!data.slides) {

      return;

    }
    if (data.slides.length > 0) {

      if (this.isFirst === false) {

        const centerId = Number.parseInt(data.slides[0].id, 10);
        if (!centerId) {

          return;

        }
        this.getProductData(centerId, 'translated');

        return;

      } else if (this.isFirst === true) {

        const subId = Number.parseInt(data.slides[1].id, 10);
        this.iinitialId = subId;
        this.activatedRoute.queryParams.subscribe((params) => {

          const paramsID = Number.parseInt(params['subId'], 10);
          if (params['id'] && !params['subId'] && !params['subsubId']) {

            this.listBeautyService.getDataofSubCategory(this.mainCategory[0].id).subscribe((ele) => {

              this.fetchData(ele);

            });

          }
          if (!paramsID || paramsID === this.mainCategory[0].id) {

            this.getProductData(subId, 'initialized');

          }

        });

      }

    }

    this.loading = false;

  }

  changed(data: SlidesOutputData) {

    this.loading = true;
    if (this.checkid === 0) {

      if (!data.slides) {

        return;

      }
      const centerId = Number.parseInt(data.slides[0].id, 10);
      this.checkid = 1;
      this.getProductData(centerId, 'dragging');

    }
    this.loading = false;

  }

  getProductData(subId: number, value:string) {

    if (this.checkid === 1) {

      this.listBeautyService.getDataofSubCategory(subId).subscribe((data) => {

        this.fetchData(data);

      });

    }
    this.checkid = 0;

  }


  fetchData(data:any) {

    this.subCategoryName = data.name;
    this.filterCategory = data.subsubcategories;

    this.brandList = data.availablebrands;
    this.sizeList = data.availableSizes;
    this.colorList = data.availabeColours;


    if (this.subsubId) {

      this.innerCategoryRoute(this.subsubId);

    } else {

      this.products = [];

      this.filterCategory.forEach((element) => {

        this.listBeautyService.getDataofSubSubCategory(element.id).subscribe((ele) => {


          Array.prototype.push.apply(this.products, ele.products);
          this.dataSource = new MatTableDataSource(this.products);
          this.dataSource$ = this.dataSource.connect();
          this.dataSource.paginator = this.paginator;

        });

      });

    }

  }

  innerCategoryRoute(ssId: number) {

    this.products = [];
    this.subsubId = ssId;


    this.listBeautyService
      .getDataofSubSubCategory(ssId)
      .subscribe((data) => {


        this.products = data.products;
        this.brandList = data.availablebrands;
        this.sizeList = data.availableSizes;
        this.colorList = data.availabeColours;
        this.susubroute = true;
        this.updateValueChanges(this.products);

      });

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

    this.dataSource = new MatTableDataSource(this.products);
    this.dataSource$ = this.dataSource.connect();
    this.dataSource.paginator = this.paginator;

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

      this._snackBar.open('you need to login before adding wishlist!', '', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      setTimeout(() => {

        this._snackBar.dismiss();

      }, this.timeOutDuration);

    }

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

  productPreview(id: number): void {

    const link = [ 'previewProduct', id ];
    this.router.navigate(link);

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