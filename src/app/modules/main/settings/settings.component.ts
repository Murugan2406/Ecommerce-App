import { Component } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogoutComponent } from '../common/logout/logout.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: [ './settings.component.scss' ]
})
export class SettingsComponent {

  constructor(private readonly router: Router,
    public dialog: MatDialog) { }


  openDialog() {

    this.dialog.open(LogoutComponent);

  }

}
