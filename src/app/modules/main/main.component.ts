import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: [ './main.component.scss' ]
})
export class MainComponent implements OnInit {

  loading = true;

  timeOutduration:number;

  constructor() {

    this.timeOutduration = 3000;

  }

  ngOnInit(): void {

    setTimeout(() => {

      this.loading = false;

    }, this.timeOutduration);

  }

  // eslint-disable-next-line class-methods-use-this
  onSideNavScroll(event:any) {

    event.stopPropagation();

  }


}
