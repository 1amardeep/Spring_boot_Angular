import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/CartItem';
import { Product } from 'src/app/common/Product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;
  pageSizeSet = [{id: 1, name: 5}, {id: 2, name: 10}, {id: 3, name: 15}, {id: 4, name: 20}];

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) { }

  products: Product[] = [];
  currentProductCategory!: number;
  isTextSearch: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProductDecider();
    })
  }

  getProductDecider() {
    this.isTextSearch = this.route.snapshot.paramMap.has('keyword');
    if (this.isTextSearch) {
      this.getSearchProduct();
    } else {
      this.getProductByCategoryId();
    }
  }

  getSearchProduct() {
    this.productService.getProductBySearch(this.route.snapshot.paramMap.get('keyword')!,
      this.thePageNumber - 1, this.thePageSize
    ).subscribe((response) => {
      this.products = response.product;
      this.thePageNumber = response.page.number + 1;
      this.thePageSize = response.page.size;
      this.theTotalElements = response.page.totalElements;
    })
  }

  getProductByCategoryId() {
    const hadCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hadCategoryId) {
      this.currentProductCategory = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentProductCategory = 1;
    }
    this.productService.getProductByCategoryId(this.currentProductCategory, this.thePageNumber - 1, this.thePageSize).subscribe((response) => {
      this.products = response.product;
      this.thePageNumber = response.page.number + 1;
      this.thePageSize = response.page.size;
      this.theTotalElements = response.page.totalElements;
    })
  }

  addToCart(product: Product){
    this.cartService.addToCart(new CartItem(product));
  }

}
