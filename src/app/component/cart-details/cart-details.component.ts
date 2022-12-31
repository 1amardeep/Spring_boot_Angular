import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/CartItem';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems : CartItem[] = [];
  totalPrice : number = 0;
  totalQuantity : number = 0;
  
  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe((totalPrice)=>{
      this.totalPrice = totalPrice;
    });
    this.cartService.totalQuantity.subscribe((totalQuantity)=>{
      this.totalQuantity = totalQuantity;
    });
    this.cartService.computeCartTotal();
  }

  incrementQuantity(cartItem: CartItem){
     this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem: CartItem){
    this.cartService.decrementCart(cartItem);
 }

 removeFromCart(cartItem: CartItem) {
  this.cartService.remove(cartItem);
 }

}
