import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ProductCategory } from '../common/ProductCategory';

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {

  private url = "http://localhost:8080/products-category";
  
  constructor(private httpclient: HttpClient) { }

  public getProductCategory(): Observable<ProductCategory[]>{
    return this.httpclient.get<ProductCategory[]>(`${this.url}`);
  }

}
