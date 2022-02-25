/* eslint-disable vars-on-top */
/* eslint-disable max-lines-per-function */
/* eslint-disable dot-notation */
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as AOS from 'aos';
import { PreviewProductService } from '../../../service/preview-product.service';
import { DashboardService } from '../../../service/dashboard.service';
import { ACCESS_TOKEN_ID, CURRENCY_TYPE } from '../../../../../assets/API/server-api';
import { ProductService } from '../../../service/product.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/modules/service/user.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewComponent } from '../../common/review/review.component';
export interface subtasks {
  name: string
  Available: boolean

}
@Component({
  selector: 'app-preview-product',
  templateUrl: './preview-product.component.html',
  styleUrls: [ './preview-product.component.scss' ]
})
export class PreviewProductComponent implements OnInit {

  productId = 0;

  productName = '';

  productPrice = '';

  offerPrice = '';

  offerPercentage = '';

  timeOutDuration:number;

  productOptions: any[] = [];

  imageWithColor: any;

  products: any[] = [];

  productReview: any[] = [];

  cartButton = 'Add to cart';

  currencyType = 'EUR';

  @Input() article: any;

  articleList: any[] = [];

  product: Array<string> = [];

  reviewS: any;

  avgRating = 0;

  noOfRating = 0;

  colorIdx = 0;

  images: any;

  sizeValue = '';

  previewSm1 = '';

  previewSm2 = '';

  previewSm3 = '';

  previewlg = '';

  aboutProduct = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.Nullam faucibus amet tristique commodo nibh proin. Laoreet integer odio pretium semper posuere in purus tristique fringilla.Suspendisse nibh massa malesuada tristique posuere. Enim ac tempus interdum egestas justo et.';

  isFirst = false;

  panelOpenState = false;

  sizeList: any[] = [];

  colors: any[] = [];

  colorsName: any[] = [];

  previewProduct :any = [];

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
      1000: {
        items: 3,
        margin: 30
      },
      1500: {
        items: 4,
        margin: 30
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
    product: new FormControl(),
    size: new FormControl(null),
    color: new FormControl(null),
    quantity: new FormControl(1),
  });


  // eslint-disable-next-line max-params
  constructor(
    private activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private _snackBar: MatSnackBar,
    private dashboardService: DashboardService,
    private previewProductService: PreviewProductService,
    private readonly productService: ProductService,
    public readonly userService: UserService,
    public dialog: MatDialog) {

    this.timeOutDuration = 1000;
    this.reviewS = [];

  }

  checkoutForm: FormGroup = new FormGroup({

    color: new FormControl(0),
    size: new FormControl(0),
    email: new FormControl('', [ Validators.required ]),
    address: new FormControl('', [ Validators.required ]),
    city: new FormControl('', [ Validators.required ]),
    country: new FormControl('', [ Validators.required ]),
    pincode: new FormControl('', [ Validators.required ]),
    firstName: new FormControl('', [ Validators.required ]),
    lastName: new FormControl(1),
    phone: new FormControl('', [ Validators.required ]),
    currency: new FormControl('', [ Validators.required ]),
    product: new FormControl(0),
    unitprice: new FormControl(0),
    quantity: new FormControl(1),

  });

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

  wishlistArray:any[] = [];

  // eslint-disable-next-line max-lines-per-function
  ngOnInit(): void {

    this.dashboardService.getOfferSales().subscribe((data: any) => {

      this.offerSale = data['products'];


    });

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      this.productService.getWishlist(localStorage.getItem(ACCESS_TOKEN_ID)).subscribe((data: any) => {


        data.forEach((element: { [x: string]: any; }) => {

          this.wishlistArray.push(element['product']);


        });

      });

    }

    this.initialChanges();


  }


  // eslint-disable-next-line max-lines-per-function
  initialChanges() {


    this.activatedRoute.queryParams.subscribe((params) => {


      this.productId = Number.parseInt(params['from'], 10);


      // eslint-disable-next-line max-statements
      this.previewProductService.getDataofSubSubCategory(this.productId).subscribe((data) => {

        this.previewProduct = data;

        if (data.productreviews.length > 0) {

          this.productReview = data.productreviews;
          const xyz = this.productReview;

          this.noOfRating = this.productReview.length;

          // eslint-disable-next-line @typescript-eslint/no-shadow
          const res = xyz.map((xyz) => xyz.rating).reduce((acc, bill) => bill + acc);

          this.avgRating = res / this.noOfRating;

        }

        this.contactForm.get('product')?.setValue(data.id);


        this.productName = data.name;

        this.setCurrencyValue(data);

        if (data.options.length > 0) {


          this.productOptions = data.options;


          if (params['colorId']) {

            this.colorIdx = Number.parseInt(params['colorId'], 10);

            this.colorIdx = this.colorIdx;


            this.contactForm.get('color')?.setValue(this.colorIdx);
            this.checkoutForm.get('color')?.setValue(this.colorIdx);

            this.productOptions.forEach((element) => {

              this.sizeList = element.sizes;


              if (element.id === this.colorIdx) {


                if (params['sizeId']) {

                  const sizeId = Number.parseInt(params['sizeId'], 10);


                  this.contactForm.get('size')?.setValue(sizeId);

                  this.checkoutForm.get('size')?.setValue(sizeId);

                }
                this.previewSm1 = element.image_one.original;
                this.previewSm2 = element.image_two.original;
                this.previewSm3 = element.image_three.original;
                this.previewlg = this.previewSm1;

              }

            });


          } else {

            this.previewSm1 = data.options[0].image_one.original;
            this.previewSm2 = data.options[0].image_two.original;
            this.previewSm3 = data.options[0].image_three.original;
            this.previewlg = this.previewSm1;

            this.sizeList = data.options[0].sizes;

          }

        } else {

          this.previewSm1 = data.image.original;
          this.previewSm2 = data.image.original;
          this.previewSm3 = data.image.original;
          this.previewlg = this.previewSm1;


        }

      });

    });

  }


  changelgImage(event: any): void {

    this.previewlg = event;

  }


  changePreviewImage = (smImage: any) => {

    this.previewlg = smImage;

  };


  changeColor(colorId: number) {

    this.router.navigate([ 'previewProduct', ], { queryParams: {from: this.productId,
      colorId } });

  }


  changeSize(sizeId :number) {

    this.router.navigate([ 'previewProduct' ], { queryParams: {from: this.productId,
      colorId: this.colorIdx,
      sizeId } });

  }

  // eslint-disable-next-line max-statements
  setCurrencyValue(datas:any) {

    if (localStorage.getItem(CURRENCY_TYPE)) {

      const cValue = localStorage.getItem(CURRENCY_TYPE);
      switch (cValue) {

      case 'EUR': {

        this.currencyType = 'EUR';

        this.offerPrice = `€${datas.OfferEuro}`;

        this.productPrice = `€${datas.productpriceEuro}`;

        this.offerPercentage = `${datas.OfferPecentageEuro}`;
        break;

      }
      case 'USD': {

        this.currencyType = 'USD';
        this.offerPrice = `$${datas.OfferDollar}`;

        this.productPrice = `$${datas.productpriceDollar}`;

        this.offerPercentage = `${datas.OfferPecentageDollar}`;
        break;

      }
      case 'SAR': {

        this.currencyType = 'SAR';
        this.offerPrice = `SAR${datas.OfferSAR}`;

        this.productPrice = `SAR${datas.productpriceSAR}`;

        this.offerPercentage = `${datas.OfferPecentageSAR}`;
        break;

      }
      case 'GBP': {

        this.currencyType = 'GBP';
        this.offerPrice = `£${datas.OfferSterling}`;

        this.productPrice = `£${datas.productpriceSterling}`;

        this.offerPercentage = `${datas.OfferPecentageSterling}`;
        break;

      }
      case 'AED': {

        this.currencyType = 'AED';
        this.offerPrice = `د.إ${datas.OfferDirham}`;

        this.productPrice = `د.إ${datas.productpriceDirham}`;

        this.offerPercentage = `${datas.OfferPecentageDirham}`;
        break;

      }

      }

    } else {

      this.currencyType = 'USD';
      this.offerPrice = `$${datas.OfferDollar}`;

      this.productPrice = `$${datas.productpriceDollar}`;

      this.offerPercentage = `${datas.OfferPecentageDollar}`;

    }

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

      this.ngOnInit();

    });


  }


  addtoCart(): void {


    if (localStorage.getItem(ACCESS_TOKEN_ID)) {


      if (this.productOptions.length > 0) {

        this.contactForm.controls['color']?.setValidators(Validators.required);

        this.contactForm.controls['color']?.updateValueAndValidity();

      }

      if (this.sizeList.length > 0) {

        this.contactForm.controls['size']?.setValidators(Validators.required);
        this.contactForm.controls['size']?.updateValueAndValidity();

      }

      if (this.contactForm.valid) {

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

      }

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

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {


      if (this.productOptions.length > 0) {

        this.contactForm.controls['color']?.setValidators(Validators.required);

        this.contactForm.controls['color']?.updateValueAndValidity();

      }

      if (this.sizeList.length > 0) {

        this.contactForm.controls['size']?.setValidators(Validators.required);
        this.contactForm.controls['size']?.updateValueAndValidity();

      }

      if (this.contactForm.valid) {

        localStorage.getItem(CURRENCY_TYPE);
        this.userService.getUserData().subscribe((data: any) => {

          if (data) {

            this.checkoutForm.get('firstName')?.setValue(data[0].address[0].firstName);
            this.checkoutForm.get('lastName')?.setValue(data[0].address[0].lastName);
            this.checkoutForm.get('phone')?.setValue(data[0].address[0].phone);
            this.checkoutForm.get('email')?.setValue(data[0].address[0].email);
            this.checkoutForm.get('address')?.setValue(data[0].address[0].address);
            this.checkoutForm.get('city')?.setValue(data[0].address[0].city);
            this.checkoutForm.get('country')?.setValue(data[0].address[0].country);
            this.checkoutForm.get('pincode')?.setValue(data[0].address[0].pincode);
            this.checkoutForm.get('currency')?.setValue(localStorage.getItem(CURRENCY_TYPE));
            this.productService.singleCheckOut(this.checkoutForm.value).subscribe((element) => {

              if (element) {


                this.productService.redirecttoCheckout(element.sessionId);

              }

            });

          } else {

            this.router.navigate([ '/login' ]);

          }

        });

      }

    }

  }

  productPreview(id: number): void {

    const link = [ 'previewProduct' ];
    this.router.navigate(link, { queryParams: {from: id }});

  }

  // eslint-disable-next-line class-methods-use-this
  addReview() {

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      const dialogRef = this.dialog.open(ReviewComponent, {
        data: {data: this.previewProduct,
          message: 'preview'}

      });
      dialogRef.afterClosed().subscribe((presentation) => {

        this.ngOnInit();

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


}
