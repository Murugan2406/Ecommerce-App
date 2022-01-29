import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos';
import { ProductService } from '../../../service/product.service';
import { ACCESS_TOKEN_ID } from '../../../../../assets/API/server-api';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: [ './wishlist.component.scss' ]
})
export class WishlistComponent implements OnInit {

  emptyProduct = false;

  products: any[] = [];

  constructor(private _snackBar: MatSnackBar,
    public readonly router: Router,
    public readonly productService: ProductService,
    private readonly activatedRoute: ActivatedRoute,
    public el: ElementRef) { }

    // eslint-disable-next-line class-methods-use-this
    @HostListener('window:scroll', [ '$event' ])onScroll(_event: any) {

    AOS.init({disable: 'mobile'});

  }

    ngOnInit(): void {

      this.activatedRoute.queryParams.subscribe((params) => {

        if (localStorage.getItem(ACCESS_TOKEN_ID)) {

          this.productService.getWishlist(localStorage.getItem(ACCESS_TOKEN_ID)).subscribe((data: any) => {

            if (data.length === 0) {

              this.emptyProduct = true;

            } else {

              this.products = data;
              this.emptyProduct = false;

            }

          });

        } else {

          this.emptyProduct = true;

        }

      });


    }

    removeProduct(id: number) {

      this.productService.deleteWishlist(id).subscribe((data: any) => {

        this.ngOnInit();

      });
      this.ngOnInit();

    }

}
