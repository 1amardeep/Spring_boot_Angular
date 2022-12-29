import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, tap } from 'rxjs/operators';
import { Product } from '../common/Product';
import { Observable } from 'rxjs';
import { ProductResponse } from '../common/ProductResponse';

interface responsedata {
  content: Product[],
  totalElements: number,
  totalPages: number,
  size: number,
  number: number
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private url = "http://localhost:8080/products";

  constructor(private httpclient: HttpClient) { }

  public getProductByCategoryId(id: number, page: number= 0, size: number = 10): Observable<ProductResponse> {

    let params = this.getParams(page,size);

    return this.httpclient.get<responsedata>(`${this.url}/category/${id}`, params).pipe(
      map((res) => {
        return  { 
          product: res.content,
          page: {
           size: res.size,
           totalElements: res.totalElements,
           totalPages: res.totalPages,
           number: res.number
          }
         }
      })
    )
  }

  public getProductBySearch(name: String,page: number= 0, size: number = 10): Observable<ProductResponse> {
    let params = this.getParams(page,size);
    return this.httpclient.get<responsedata>(`${this.url}/search/${name}`, params).pipe(
      map((res) => {
        return { 
         product: res.content,
         page: {
          size: res.size,
          totalElements: res.totalElements,
          totalPages: res.totalPages,
          number: res.number
         }
        }
      })
    )
  }

  public getProductByProductId(id: number): Observable<Product> {
    return this.httpclient.get<Product>(`${this.url}/product/${id}`);
  }

  getParams(page: number, size: number){
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', size);
    return {params};
  }

}
