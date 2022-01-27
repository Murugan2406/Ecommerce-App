import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as AOS from 'aos';
import { PreviewProductService } from '../../../service/preview-product.service';
import { DashboardService } from '../../../service/dashboard.service';
import { ACCESS_TOKEN_ID, CURRENCY_TYPE } from '../../../../../assets/API/server-api';
import { ProductService } from '../../../service/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface subtasks {
  name: string;
  Available: boolean;

}
@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.component.html',
  styleUrls: [ './preview-product.component.scss' ]
})
export class PreviewProductComponent implements OnInit {

  productId = 0;

  productName = '';

  productPrice = 0;

  offerPrice = 0;

  offerPercentage = 0;

  timeOutDuration:number;

  productOptions: any[] = [];

  imageWithColor: any;

  products: any[] = [];

  cartButton = 'Add to cart';

  currencyType = 'EUR';

  @Input() article: any;

  articleList: any[] = [];


  product: Array<string> = [];

  reviewS: any;

  images: any;

  sizeValue = '';

  previewSm1 = '';

  previewSm2 = '';

  previewSm3 = '';

  previewlg = '';


  aboutProduct = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nullam faucibus amet tristique commodo nibh proin. Laoreet integer odio pretium semper posuere in purus tristique fringilla.Suspendisse nibh massa malesuada tristique posuere. Enim ac tempus interdum egestas justo et.';

  isFirst = false;

  panelOpenState = false;

  size: any[] = [];

  colors: any[] = [];

  colorsName: any[] = [];

  data: any[] = [ {
    product: null,
    size: null,
    color: null,
    quantity: 1
  } ];

  customOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 200,
    autoplayHoverPause: false,
    navText: [ '<i class=\'fa fa-long-arrow-left\'></i>', '<i class=\'fa fa-long-arrow-right\'></i>' ],
    responsive: {
      0: {
        items: 1,
        margin: 30
      },
      500: {
        items: 2,
        margin: 30
      },
      768: {
        items: 2,
        margin: 30
      },
      769: {
        items: 3,
        margin: 40
      }
    },
    nav: true
  };

  suggestionOptions: any = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 200,
    autoplayHoverPause: false,
    navText: [ '<i class=\'fa fa-long-arrow-left\'></i>', '<i class=\'fa fa-long-arrow-right\'></i>' ],
    responsive: {
      0: {
        items: 2,
        margin: 10
      },
      500: {
        items: 2,
        margin: 10
      },
      768: {
        items: 3,
        margin: 40
      },
      1000: {
        items: 5,
        margin: 40
      },
      1500: {
        items: 5,
        margin: 40
      }
    },
    nav: true
  };

  offerSale: any[] = [];

  contactForm: FormGroup = new FormGroup({
    product: new FormControl(null),
    size: new FormControl(null),
    color: new FormControl(null),
    quantity: new FormControl(1),
  });


  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private _snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private previewProductService: PreviewProductService,
    private readonly productService: ProductService,) {


    this.timeOutDuration = 700;
    this.reviewS = [];

  }

  // eslint-disable-next-line class-methods-use-this
  counter(index: number) {

    return new Array(index);

  }

  // eslint-disable-next-line class-methods-use-this
  @HostListener('window:scroll', [ '$event' ]) onScroll(_event: any) {

    AOS.init({disable: 'mobile'});

  }


  leftMenuDrawerOpened = true;

  value: any = 0;

  ngOnInit(): void {


    this.dashboardService.getOfferSales().subscribe((data: any) => {

      this.offerSale = data;

    });
    this.activatedRoute.params.subscribe((params) => {

      // eslint-disable-next-line dot-notation
      this.productId = Number.parseInt(params['id'], 10);
      this.previewProductService.getDataofSubSubCategory(this.productId).subscribe((data) => {

        this.contactForm.get('product')?.setValue(data.id);

        this.productName = data.name;


        this.productOptions = data.options;

        if (data.options.length > 0) {

          this.contactForm.get('color')?.setValue(this.productOptions[0].id);
          this.productOptions.forEach((element) => {

            this.colors.push(element.colorhash);

            this.colorsName.push(element.color);

          });
          this.changeColor(this.colors[0]);

        } else {

          this.previewSm1 = data.image.original;
          this.previewlg = this.previewSm1;

        }

      });

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

  changelgImage(event: any): void {

    this.previewlg = event;

  }


  changePreviewImage = (smImage: any) => {

    this.previewlg = smImage;

  };


  changeColor(color: string) {


    this.contactForm.get('size')?.reset();
    this.productOptions.forEach((element) => {

      if (element.colorhash === color) {


        this.size = element.sizes;


        if (this.size.length !== 0) {


          this.contactForm.get('size')?.setValidators(Validators.required);
          this.contactForm.get('size')?.setValue(this.size[0].id);

        } else {


          this.contactForm.get('size')?.clearValidators();

        }
        this.previewSm1 = element.image_one.original;
        this.previewSm2 = element.image_two.original;
        this.previewSm3 = element.image_three.original;
        this.previewlg = this.previewSm1;

      }

    });

  }

  addtoWishlist(id: number) {

    this.data[0].product = id;


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

  }


  addtoCart(): void {

    if (!this.contactForm.valid) {

    } else if (localStorage.getItem(ACCESS_TOKEN_ID) !== null) {

      this.productService.addtoCart(this.contactForm.value).subscribe((data) => {

        this.cartButton = 'go to cart';
        window.location.reload();
        this._snackBar.open('product added to cart !', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        setTimeout(() => {

          this._snackBar.dismiss();

        }, this.timeOutDuration);

      });


    } else {

      this._snackBar.open('please login to proceed !', '', {
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
      setTimeout(() => {

        this._snackBar.dismiss();

      }, this.timeOutDuration);

    }

  }


  gotoCheckout(): void {

    if (localStorage.getItem(ACCESS_TOKEN_ID) === null) {

      this.router.navigate([ 'login' ]);

    }

  }


  productPreview(id: number): void {

    const link = [ 'previewProduct', id ];
    this.router.navigate(link);

  }

}
