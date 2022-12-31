import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ICountryResponse, IStateResponse } from '../common/Form';

@Injectable({
  providedIn: 'root'
})
export class FormStaticService {
  
  private url = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }


  getCreditCardMonths( stMonth :number = 1): Observable<number[]>{
    let data : number[]=[];
    let  startMonth = stMonth;
    for(let i=startMonth; i<=12; i++) data.push(i);
    return of(data);
  }

  getCreditCardYear(): Observable<number[]>{
    let data : number[] = [];
    let startYear = new Date().getFullYear();
    let endYear = startYear + 10;
    for(let i= startYear; i<=endYear; i++){
      data.push(i);
    } 
    return of(data);
  }

  getStateWithCountryId(countryId: number): Observable<IStateResponse[]>{
    return this.httpClient.get<IStateResponse[]>(`${this.url}/state/${countryId}`).pipe(
      map((res) => {
        return res;
      })
    )
  }

  getAllContries(): Observable<ICountryResponse[]>{
    return this.httpClient.get<ICountryResponse[]>(`${this.url}/country`).pipe(
      map((res) => {
        return res;
      })
    )
  }
}
