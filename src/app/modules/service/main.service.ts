import { EventEmitter, Injectable, Output, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(@Inject(DOCUMENT) private document: Document) { }

  @Output() fire: EventEmitter<any> = new EventEmitter();

  @Output() dataChangeObserver: EventEmitter<any> = new EventEmitter();

  private sidenav: MatSidenav | any;

  public setSidenav(sidenav: MatSidenav) {

    this.sidenav = sidenav;

  }

  public open() {

    return this.sidenav.open();

  }

  public close() {

    return this.sidenav.close();

  }

  public toggle(): void {

    this.sidenav.toggle();

  }

}
