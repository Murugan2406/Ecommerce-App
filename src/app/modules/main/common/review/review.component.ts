import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/modules/service/user.service';
import { CURRENCY_TYPE } from '../../../../../assets/API/server-api';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: [ './review.component.scss' ]
})
export class ReviewComponent implements OnInit {

  data:any[] = [];

  product:any = [];

  image = '';

  formisvalid = false;

  imgname = '';

  currencyType = '';

  price = '';

  value = 0;

  Comments = null;

  error = '';

  productId = 0;


  contactForm: FormGroup;

  constructor(private readonly userService: UserService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: {data: any, message: string},) {

    if (dialogData.message === 'preview') {

      this.product = dialogData.data;
      this.image = dialogData.data.image.original;
      this.imgname = dialogData.data.name;
      this.setCurrencyValue(dialogData.data);


    } else {

      this.product = dialogData.data.product;
      this.image = dialogData.data.product.image.original;
      this.imgname = dialogData.data.product.name;
      this.setCurrencyValue(dialogData.data.product);

    }

    this.contactForm = new FormGroup({
      product: new FormControl(null),
      rating: new FormControl(null, [ Validators.required ]),
      comment: new FormControl('', [ Validators.required ]),
    });

  }

  // eslint-disable-next-line class-methods-use-this
  counter(index: number) {

    return new Array(index);

  }

  ngOnInit(): void {

    this.contactForm.get('product')?.setValue(this.product.id);

  }

  setCurrencyValue(data:any) {


    const cValue = localStorage.getItem(CURRENCY_TYPE);
    switch (cValue) {

    case 'EUR': {

      this.price = `€${data.OfferEuro}`;
      break;

    }
    case 'USD': {

      this.price = `$${data.OfferDollar}`;
      break;

    }
    case 'SAR': {

      this.price = `SAR${data.OfferSAR}`;
      break;

    }
    case 'GBP': {


      this.price = `£${data.OfferSterling}`;
      break;

    }
    case 'AED': {


      this.price = `د.إ${data.OfferDirham}`;
      break;

    }

    }

  }

  selectedIndex = 0;

  nonSelectedIndex = 0;

  SelectedIndex(index:any) {

    this.value = index;
    this.selectedIndex = index;

  }

  NonSelectedIndex(index:any) {

    if (this.selectedIndex === 0) {

      this.selectedIndex = index;
      this.nonSelectedIndex = 5 - index;

    } else {

      this.selectedIndex += index;
      this.nonSelectedIndex = 5 - this.selectedIndex;

    }

    this.value = this.selectedIndex;

  }

  submitForm() {

    if (this.Comments === null) {

      this.error = '*please give a comments';

    } else {

      this.contactForm.get('comment')?.setValue(this.Comments);

    }
    if (this.value !== 0) {

      this.contactForm.get('rating')?.setValue(this.value);


    } else {

      this.error = '*please give a rating';

    }

    if (this.contactForm.valid) {

      this.error = '';
      this.userService.addReviews(this.contactForm.value).subscribe((data) => {


        this.formisvalid = true;
        this.dialog.closeAll();

      });

    }


  }

}
