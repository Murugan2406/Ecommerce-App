import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferSalesComponent } from './offer-sales.component';

describe('OfferSalesComponent', () => {

  let component: OfferSalesComponent;
  let fixture: ComponentFixture<OfferSalesComponent>;

  beforeEach(async() => {

    await TestBed.configureTestingModule({
      declarations: [ OfferSalesComponent ]
    })
      .compileComponents();

  });

  beforeEach(() => {

    fixture = TestBed.createComponent(OfferSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {

    expect(component).toBeTruthy();

  });

});
