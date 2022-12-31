import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/CartItem';
import { Product } from 'src/app/common/Product';
import { CartService } from 'src/app/service/cart.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productDetail! : Product;

  constructor(private route: ActivatedRoute,
     private productService: ProductService,
     private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=> {
      this.getDetails();
    })
  }

  getDetails(){
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductByProductId(id).subscribe((response)=>{
      this.productDetail = response;
    })
  }

  addToCart(product: Product){
    this.cartService.addToCart(new CartItem(product));
  }

}
