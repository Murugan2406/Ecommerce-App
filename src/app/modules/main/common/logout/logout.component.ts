import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ACCESS_TOKEN_ID, CURRENCY_TYPE, VERIFY } from '../../../../../assets/API/server-api';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: [ './logout.component.scss' ]
})
export class LogoutComponent {

  constructor(private readonly router: Router) { }


  doLogout = ():void => {

    localStorage.removeItem(ACCESS_TOKEN_ID);
    localStorage.removeItem(CURRENCY_TYPE);
    localStorage.setItem(VERIFY, 'true');
    this.router.navigate([ '/' ]);

  };

}
