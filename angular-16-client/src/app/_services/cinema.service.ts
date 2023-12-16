import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cinema } from '../models/cinema.model';

const baseUrl = 'http://localhost:8000/api/cinemas';

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(baseUrl);
  }

  getPublished(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${baseUrl}/published`);
  }


  get(id: any): Observable<Cinema> {
    return this.http.get<Cinema>(`${baseUrl}/${id}`);
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

  findByName(name: any): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${baseUrl}?name=${name}`);
  }
  findByVendorID(vendorID: any): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${baseUrl}/VendorID?vendorID=${vendorID}`);
  }

  deleteAllByVendorID(vendorID: any): Observable<Cinema[]> {
    return this.http.delete<Cinema[]>(`${baseUrl}/VendorIDdel/vendorID?vendorID=${vendorID}`);
  }
  getMarkerPositions(cinemaId: string): Observable<any> {
    return this.http.get<any>(`${baseUrl}/marker-positions/${cinemaId}`);
  }
}
