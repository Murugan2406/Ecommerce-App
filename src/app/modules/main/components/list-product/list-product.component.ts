/* eslint-disable max-lines */
/* eslint-disable dot-notation */
import {Component, HostListener, OnInit, ViewChild, } from '@angular/core';
import {OwlOptions, SlidesOutputData, } from 'ngx-owl-carousel-o';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {ActivatedRoute, Router, } from '@angular/router';
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

  sizeValue:any[] = [];

  brandValue:any[] = [];

  colorValue:any[] = [];

  sizeTempArray:any[] = [];

  colorTempArray:any[] = [];

  brandTempArray:any[] = [];

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

  filterProducts:any = [];

  sortingArray: any[] = [];

  hparam: any;

  subId = 0;

  ssId = 0;

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
    URLhashListener: true,
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
      startprice: new FormControl(null, [ Validators.required ]),
      endprice: new FormControl(null, [ Validators.required ]),
    });
    this.dataSource = new MatTableDataSource(this.products);

  }

  @HostListener('window:load', [ '$event' ])
  onLoad() {

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

  sectionId = 0;

  ssName:string | null = '';

  quaryParams:object | any = '';


  ngOnInit(): void {

    this.products = [];
    this.onLoad();


    this.activatedRoute.params.subscribe((params) => {

      this.checkid = 1;
      this.hparam = params;

      this.setdefaultData(params['id']);

      this.sectionId = Number.parseInt(params['id'], 10);

    });
    this.setCurrencyValue();


    this.activatedRoute.queryParams.subscribe((params) => {

      this.quaryParams = params;
      this.ssName = this.activatedRoute.snapshot.fragment;

      const subId = Number.parseInt(params['subId'], 10);
      const subsubId = Number.parseInt(params['ssId'], 10);

      this.ssId = subsubId;

      this.products = [];

      this.updateValueChanges(this.products);
      if (Object.keys(this.quaryParams).length === 0) {


        this.activatedRoute.params.subscribe((param) => {

          const sectionId = Number.parseInt(param['id'], 10);


          this.listBeautyService.getDataofMainCategory(sectionId).subscribe((data) => {


            const initialsubId = this.mainCategory[0]['id'];

            this.products = [];

            this.getProductData(initialsubId);


          });


        });

      } else {

        this.getProductData(subId);

      }

    });


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

  setdefaultData(id: number) {

    this.listBeautyService.getDataofMainCategory(id).subscribe((data) => {


      this.sectionTitle = data.name;
      this.mainCategory = data.subcategories;


      if (this.ssName === null) {

        this.ssName = data.subcategories[0].name;

      }

    });

  }

  iinitialId = 0;

  indexId = 0;

  // eslint-disable-next-line max-statements
  onIndexChange(data: SlidesOutputData) {


    this.ssName = this.activatedRoute.snapshot.fragment;

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

        this.subId = centerId;
        const fragment = this.activatedRoute.snapshot.fragment || '';


        // eslint-disable-next-line no-undefined
        if (isNaN(this.quaryParams) && this.quaryParams['ssId'] === undefined) {

          this.router.navigate([], { fragment,
            queryParams: {subId: centerId} });

        }

        return;

      } else if (this.isFirst === true) {

        const centerId = Number.parseInt(data.slides[1].id, 10);
        this.indexId = centerId;


        if (this.centervalueId === centerId) {

          return;

        }

        this.subId = centerId;

        const fragment = this.activatedRoute.snapshot.fragment || '';


        // eslint-disable-next-line no-undefined
        if (isNaN(this.quaryParams) && this.quaryParams['ssId'] === undefined) {

          this.router.navigate([], { fragment,
            queryParams: {subId: centerId} });

        }


      }

    }

    this.loading = false;

  }

  getProductData(subId: number) {

    this.products = [];


    this.listBeautyService.getDataofSubCategory(subId).subscribe((data) => {

      this.fetchData(data);

    });


  }


  fetchData(data:any) {

    this.subCategoryName = data.name;
    this.filterCategory = data.subsubcategories;
    this.brandList = data.availablebrands;
    this.sizeList = data.availableSizes;
    this.colorList = data.availabeColours;
    this.products = [];


    if (this.ssId) {


      this.innerCategoryRoute(this.ssId);

    } else {

      this.filterCategory.forEach((element) => {

        this.listBeautyService.getDataofSubSubCategory(element.id).subscribe((ele) => {


          Array.prototype.push.apply(this.products, ele.products);
          Array.prototype.push.apply(this.filterProducts, ele.products);

          this.updateValueChanges(this.products);

        });

      });

    }

  }

  innerCategoryRoute(ssId: number) {

    this.products = [];
    this.ssId = ssId;


    this.listBeautyService.getDataofSubSubCategory(ssId).subscribe((data) => {

      console.log(data);

      this.products = data.products;


      this.filterProducts = data.products;
      this.brandList = data.availablebrands;
      this.sizeList = data.availableSizes;
      this.colorList = data.availabeColours;
      this.updateValueChanges(data.products);

    });

  }

  updateValueChanges(products:any) {

    this.dataSource = products;
    this.dataSource.paginator = this.paginator;

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


      this.sortingArray.sort((firsyArray: any, secArray: any) => firsyArray.OfferSterling - secArray.OfferSterling);

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

    this.updateValueChanges(this.products);

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


  


}
