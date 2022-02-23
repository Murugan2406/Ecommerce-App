/* eslint-disable dot-notation */
import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../service/header.service';
import { UserService } from '../../../service/user.service';
import * as AOS from 'aos';
import { ACCESS_TOKEN_ID, CURRENCY_TYPE, LANGUAGE } from '../../../../../assets/API/server-api';
import { ProductService } from '../../../service/product.service';
import { LogoutComponent } from '../logout/logout.component';
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: [ './header.component.scss' ]
})
export class HeaderComponent implements OnInit {

  loginTitle = 'Login';

  user = '';

  cartLength = null;

  showArrow = false;

  showFiller = false;

  megaMenu = 'hide_megaMenu';

  subCategories: any[] = [];

  mainCategory: any = [];

  subsubCategories: any = [];

  toggleClass = false;

  CategoryId = 0;

  mainCategoryId = 0;

  categoryName = 0;

  fontStyle?: string;

  toggleActive = false;

  quantity: number;

  subCategoryId: any;

  ssName: any;

  logoutNeeded = true;

  searchValue = '';

  linkFrom = '';

  size: any[] = [
    { name: 'FR ',
      completed: false },
    { name: 'En',
      completed: false },
  ];

  message = 'Hola Mundo!';

  @Output() messageEvent = new EventEmitter<string>();

  constructor(
    private router: Router,

    private readonly headerService: HeaderService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {

    this.quantity = 1;


  }

  currencyForm: FormGroup = new FormGroup({
    currency: new FormControl('EUR'),
  });

  LanguageForm: FormGroup = new FormGroup({
    language: new FormControl('English'),
  });

  searchForm: FormGroup = new FormGroup({
    inputValue: new FormControl(''),
  });

  isSectionActive(section: string): boolean {

    let element = false;
    this.activatedRoute.fragment.subscribe((fragment: string | null) => {

      element = fragment === section.split('#').pop();

    });
    return element;

  }

  ngOnInit(): void {

    this.showArrow = false;
    this.toggleClass = false;
    AOS.init();
    this.setdefaultValue();

    this.activatedRoute.params.subscribe((params) => {

      this.searchValue = params['value'];
      this.linkFrom = params['from'];

      if (this.linkFrom === 'searchResult') {

        this.searchForm.get('inputValue')?.setValue(this.searchValue);

      }

    });


    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      this.userService.getUserData().subscribe((data: any) => {

        this.user = data[0].name;
        this.logoutNeeded = false;

      });
      this.productService.getCart().subscribe((data: any) => {

        this.cartLength = data.length;

      });

    } else {

      this.user = 'login';
      this.logoutNeeded = true;

    }
    this.headerService.getCategory().subscribe((data: any) => {

      this.mainCategory = data;

    });

  }

  setdefaultValue() {

    if (localStorage.getItem(CURRENCY_TYPE)) {

      this.currencyForm.get('currency')?.setValue(localStorage.getItem(CURRENCY_TYPE));

    } else {

      this.currencyForm.get('currency')?.setValue('EUR');
      localStorage.setItem(CURRENCY_TYPE, this.currencyForm.get('currency')?.value);

    }

    if (localStorage.getItem(LANGUAGE)) {

      this.LanguageForm.get('language')?.setValue(localStorage.getItem(LANGUAGE));

    } else {

      this.currencyForm.get('language')?.setValue('English');
      localStorage.setItem(LANGUAGE, this.LanguageForm.get('language')?.value);

    }

  }

  ClosePanel = () => {

    this.subCategories = [];

  };

  openSubCategories(event: any, value: any, name:any): void {

    this.CategoryId = value;
    this.mainCategoryId = value;
    this.categoryName = name;
    this.subCategories = event;
    this.subsubCategories = [];

  }

  openSubSubCategories(event: any, id: number, name: string) {

    this.subCategoryId = id;
    this.ssName = name;
    this.subsubCategories = event;

  }

  // eslint-disable-next-line class-methods-use-this
  upsertSearch(): void {

    if (this.searchForm.valid) {

      const language = this.searchForm.get('inputValue')?.value;


      this.router.navigate([ '/specialProducts' ], { queryParams: {value: language,
        from: 'searchResult'} });

    }

  }

  toggleLanguage(): void {

    const language = this.LanguageForm.get('language')?.value;

    localStorage.setItem(LANGUAGE, language);
    window.location.reload();


  }


  changeCurrency(): void {

    const value = this.currencyForm.get('currency')?.value;
    localStorage.setItem(CURRENCY_TYPE, value);
    window.location.reload();

  }


  logOut() {

    this.dialog.open(LogoutComponent);

  }

  myAccountNavigate() {

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      this.userService.getUserData().subscribe((data: any) => {

        this.user = data[0].name;

      });
      this.router.navigate([ 'settings/myaccount' ]);

    } else {


      /*
       * Const dialogRef = this.dialog.open(LoginComponent, {
       * });
       */

      this.user = 'login';
      this.router.navigate([ '/login' ]);

    }

  }


}

