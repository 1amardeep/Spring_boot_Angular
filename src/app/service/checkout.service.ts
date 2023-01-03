import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Purchase } from '../common/purchase';

interface response {
  orderTrackingNumber: String
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private url = "http://localhost:8080/checkout/purchase";

  constructor(private httpClient: HttpClient) { 
  
  }

  checkout(data: Purchase): Observable<response>{
   return  this.httpClient.post<response>(this.url, data).pipe(
    map((res)=>{
      return res;
    })
   );
  }

}
