import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import {Location} from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss', '../auth.scss' ]
})
export class LoginComponent {

  error: string | null | undefined;

  timeOutduration:number;


  contactForm: FormGroup;


  constructor(
    private readonly router: Router,

    private readonly userService: UserService,
    private readonly _snackBar: MatSnackBar,
    private _location: Location) {

    const passwordlength = 5;
    this.timeOutduration = 3000;


    this.contactForm = new FormGroup({
      email: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required, Validators.minLength(passwordlength) ]),
    });

  }


  ngOnInit(): void {

    if (localStorage.getItem(ACCESS_TOKEN_ID)) {

      this.router.navigate([ '/' ]);

    }

  }


  submitContact(): void {


    if (this.contactForm.valid === true) {

      this.error = null;

      if (!(/^(?<name>[a-zA-Z0-9_\-.]+)@(?<domain>[a-zA-Z0-9_\-.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.contactForm.value.email)) {

        this.error = ' * please enter valid email address';

      } else {

        this.error = '';
        this.userService.login(this.contactForm.value).subscribe((data: any) => {

          localStorage.setItem(ACCESS_TOKEN_ID, data.access);

          if (localStorage.getItem(ACCESS_TOKEN_ID)) {

            this._snackBar.open('Login successfull !', '', {
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
            setTimeout(() => {

              this._snackBar.dismiss();


            }, this.timeOutduration);
            this._location.back();


          }

        }, (error) => {

          this.error = `*${error.error.detail}`;

        });

      }


    }

  }

}
