import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;
  constructor( private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.totalPrice.subscribe((totalPrice)=>{
       this.totalPrice = totalPrice;
    })
    this.cartService.totalQuantity.subscribe((totalQuantity)=> {
      this.totalQuantity = totalQuantity;
    })
  }

}
