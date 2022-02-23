import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../../../service/product.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { CURRENCY_TYPE, ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: [ './cart.component.scss' ]
})
export class CartComponent implements OnInit {

  carts: any[] = [];

  toggleActive = false;

  fboForm: FormGroup | any;

  currencyType = 'EUR';

  over = true;

  dataSource = new MatTableDataSource<any>();


  @ViewChild('myname') input: any;

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly fBuilder: FormBuilder,
    public readonly userService: UserService,) {

  }

  contactForm: FormGroup = new FormGroup({
    quantity: new FormControl(1),
  });


  checkoutForm: FormGroup = new FormGroup({
    email: new FormControl('', [ Validators.required ]),
    address: new FormControl('', [ Validators.required ]),
    city: new FormControl('', [ Validators.required ]),
    country: new FormControl('', [ Validators.required ]),
    pincode: new FormControl('', [ Validators.required ]),
    firstName: new FormControl('', [ Validators.required ]),
    lastName: new FormControl(1),
    phone: new FormControl('', [ Validators.required ]),
    currency: new FormControl('', [ Validators.required ]),

  });

  private initFboForm = () => {

    this.fboForm = this.fBuilder.group({
      totalAmount: this.fBuilder.control(0, [ Validators.required ]),
      shippingFee: this.fBuilder.control(0),
      grandTotal: this.fBuilder.control(0, [ Validators.required ]),
    });

  };


  // eslint-disable-next-line max-lines-per-function
  ngOnInit() {

    this.initFboForm();
    if (localStorage.getItem(ACCESS_TOKEN_ID)) {


      this.productService.getCart().subscribe((data: any) => {

        console.log(data);
        this.carts = data;

        if (localStorage.getItem(CURRENCY_TYPE)) {

          const cValue = localStorage.getItem(CURRENCY_TYPE);
          this.currencySet(cValue);

        } else {

          this.currencyType = 'EUR';
          let totalAmountt = 0;
          for (let index = 0; index < this.carts.length; index++) {

            totalAmountt += this.carts[index].product.OfferEuro * this.carts[index].quantity;

          }
          this.setformValue(totalAmountt);

        }

      });

    }

  }

  // eslint-disable-next-line max-statements
  currencySet(cValue: string | null) {


    switch (cValue) {

    case 'EUR': {

      this.currencyType = 'EUR';
      let totalAmount = 0;

      for (let index = 0; index < this.carts.length; index++) {

        totalAmount += this.carts[index].product.OfferEuro * this.carts[index].quantity;

      }
      this.setformValue(totalAmount);
      break;

    }
    case 'USD': {

      this.currencyType = 'USD';
      let totalAmount = 0;

      for (let index = 0; index < this.carts.length; index++) {

        totalAmount += this.carts[index].product.OfferDollar * this.carts[index].quantity;

      }

      this.setformValue(totalAmount);
      break;

    }
    case 'SAR': {

      this.currencyType = 'SAR';
      let totalAmount = 0;

      for (let index = 0; index < this.carts.length; index++) {

        totalAmount += this.carts[index].product.OfferDollar * this.carts[index].quantity;

      }

      this.setformValue(totalAmount);
      break;

    }
    case 'GBP': {

      this.currencyType = 'GBP';
      let totalAmount = 0;
      for (let index = 0; index < this.carts.length; index++) {

        totalAmount += this.carts[index].product.OfferSterling * this.carts[index].quantity;

      }

      this.setformValue(totalAmount);
      break;

    }
    case 'AED': {

      this.currencyType = 'AED';
      let totalAmount = 0;
      for (let index = 0; index < this.carts.length; index++) {

        totalAmount += this.carts[index].product.OfferDirham * this.carts[index].quantity;

      }

      this.setformValue(totalAmount);
      break;

    }

    }

  }

  setformValue(totalAmount: number) {

    const sfee = this.fboForm.get('shippingFee')?.value;
    const grandT = totalAmount - sfee;
    this.fboForm.get('totalAmount')?.setValue(totalAmount);
    this.fboForm.get('grandTotal')?.setValue(grandT);

  }

  inputValueChange(event: any, id: number) {

    this.contactForm.get('quantity')?.setValue(event);
    this.productService.updateCart(this.contactForm.value, id).subscribe((data) => {

      this.ngOnInit();

    });

  }

  decrementValue(id: number): void {

    const quantity = Number.parseInt(this.input.nativeElement.value, 10);
    const qValue = quantity - 1;
    this.contactForm.get('quantity')?.setValue(qValue);
    this.productService.updateCart(this.contactForm.value, id).subscribe((data) => {

      this.ngOnInit();

    });

  }

  incrementValue(id: number): void {

    const quantity = Number.parseInt(this.input.nativeElement.value, 10);
    const qValue = quantity + 1;
    this.contactForm.get('quantity')?.setValue(qValue);
    this.productService.updateCart(this.contactForm.value, id).subscribe((data) => {

      this.ngOnInit();

    });

  }


  checkOut(): void {

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
        this.productService.checkOut(this.checkoutForm.value).subscribe((element) => {

          if (element) {

            this.productService.redirecttoCheckout(element.sessionId);

          }

        });

      } else {

        this.router.navigate([ '/login' ]);

      }

    });

  }

  navigateToHome(): void {

    this.router.navigate([ '/' ]);

  }

  removefromCart(id: number): void {

    this.productService.deleteCart(id).subscribe((data: any) => {

      this.ngOnInit();

    });

  }

}
