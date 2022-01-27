import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { VERIFY } from '../../../../../assets/API/server-api';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: [ './user-info.component.scss' ]
})
export class UserInfoComponent implements OnInit {

  error = '';

  userInfo: FormGroup = new FormGroup({

    firstName: new FormControl('', [ Validators.required ]),

    lastName: new FormControl('', [ Validators.required ]),

    email: new FormControl('', [ Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') ]),

    phone: new FormControl('', [ Validators.required, Validators.pattern('[0-9 ]{11}') ]),

    country: new FormControl('', [ Validators.required ]),

    city: new FormControl('', [ Validators.required ]),

    address: new FormControl('', [ Validators.required ]),

    pincode: new FormControl('', [ Validators.required ]),

  });

  constructor(public readonly activatedRoute: ActivatedRoute,
    private readonly userService: UserService,
    private readonly _snackBar: MatSnackBar,

    private readonly router: Router,) { }

  ngOnInit(): void {


    this.activatedRoute.queryParams.subscribe((params:any) => {

      this.userInfo.get('firstName')?.setValue(params.Username);
      this.userInfo.get('email')?.setValue(params.email);

    });

  }

  upsertBank(): void {

    if (this.userInfo.valid === true) {

      const {firstName, lastName, email, phone,
        country, city, address, pincode } = this.userInfo.value as {firstName:string, lastName:string,
           email:string, phone:string, country:string, city:string, address:string, pincode:string };

      this.userService.saveContactInfo({firstName,
        lastName,
        email,
        phone,
        country,
        city,
        address,
        pincode }).subscribe((userR: any) => {

        localStorage.setItem(VERIFY, 'true');
        this.router.navigate([ '/' ]);
        this._snackBar.open('Account  successfully created !', '', {
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
        setTimeout(() => {

          this._snackBar.dismiss();

        }, 500);

      }, (error: { error: { detail: string; }; }) => {

        this.error = `*${error.error.detail}`;

      });

    } else {

    }

  }

}
