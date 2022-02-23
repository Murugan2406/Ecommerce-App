import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutComponent } from '../common/logout/logout.component';
import { ACCESS_TOKEN_ID, CURRENCY_TYPE, VERIFY } from '../../../../assets/API/server-api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent {

  constructor(private readonly router: Router,
    public dialog: MatDialog) { }


  // openDialog() {

  //   this.dialog.open(LogoutComponent);

  // }

  openDialog(): void {

    const dialogRef = this.dialog.open(LogoutComponent, {
      data: {title: 'Do you want to logout?'}
    });
    dialogRef.afterClosed().subscribe((result) => {


      if (result) {

        localStorage.removeItem(ACCESS_TOKEN_ID);
        localStorage.removeItem(CURRENCY_TYPE);
        localStorage.setItem(VERIFY, 'true');
        this.router.navigate([ '/' ]);

      }

    });

  }


}
