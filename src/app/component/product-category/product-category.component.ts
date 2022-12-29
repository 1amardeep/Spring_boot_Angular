import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/ProductCategory';
import { ProductCategoryService } from 'src/app/service/product-category.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories!: ProductCategory[];

  constructor(private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
    this.loadProductCategory()
  }

  loadProductCategory() {
    this.productCategoryService.getProductCategory().subscribe((response)=> {
      this.productCategories = response;
    })
  }

}
