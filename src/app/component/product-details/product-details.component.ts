import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/Product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  productDetail! : Product;

  constructor(private route: ActivatedRoute, private productService: ProductService) { }

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

}
