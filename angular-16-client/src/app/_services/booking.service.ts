import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';

const baseUrl = 'http://localhost:8000/api/bookings';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Booking[]> {
    return this.http.get<Booking[]>(baseUrl);
  }

  getPublished(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${baseUrl}/published`);
  }


  get(id: any): Observable<Booking> {
    return this.http.get<Booking>(`${baseUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByName(name: any): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${baseUrl}?name=${name}`);
  }
  findByVendorID(vendorID: any): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${baseUrl}/VendorID?vendorID=${vendorID}`);
  }

  findByCustomerID(customerID: any): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${baseUrl}/CustomerID?customerID=${customerID}`);
  }

  deleteAllByCustomerID(customerID: any): Observable<Booking[]> {
    return this.http.delete<Booking[]>(`${baseUrl}/CustomerID/customerID?customerID=${customerID}`);
  }

}
