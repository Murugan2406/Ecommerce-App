import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../service/user.service';
import { ACCESS_TOKEN_ID, VERIFY } from '../../../../../assets/API/server-api';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ './signup.component.scss', '../auth.scss' ]
})
export class SignupComponent {

  error = '';

  passwordlength:number;

  contactForm: FormGroup;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly _snackBar: MatSnackBar,) {

    this.passwordlength = 5;

    this.contactForm = new FormGroup({
      name: new FormControl('', [ Validators.required ]),
      email: new FormControl('', [ Validators.required ]),
      password: new FormControl('', [ Validators.required, Validators.minLength(this.passwordlength) ]),
      cpassword: new FormControl('', [ Validators.required, Validators.minLength(this.passwordlength) ]),
    });

  }


  submitContact():void {


    if (this.contactForm.valid === true) {

      if (!(/^(?<name>[a-zA-Z0-9_\-.]+)@(?<domain>[a-zA-Z0-9_\-.]+)\.(?<extn>[a-zA-Z]{2,5})$/ugm).test(this.contactForm.value.email)) {

        this.error = 'Please provide a valid email.';
        return;

      }
      if (this.contactForm.value.password !== this.contactForm.value.cpassword) {

        this.error = '* Password and confirm password should be same.';

      } else {

        this.error = '';
        const {name, email, password} = this.contactForm.value as {name:string, email:string, password:string};
        this.userService.signUp({name,
          email,
          password}).subscribe((userR) => {

          const Username = this.contactForm.get('name')?.value;


          this.userService.login({email,
            password}).subscribe((data: any) => {

            localStorage.setItem(ACCESS_TOKEN_ID, data.access);
            localStorage.setItem(VERIFY, 'true');

          });
          this.router.navigate([ 'userinfo' ], {
            queryParams: {
              Username,
              email
            },
          });

        }, (error) => {

          this.error = `*${error.error.email}`;

        });

      }

    }

  }

}
