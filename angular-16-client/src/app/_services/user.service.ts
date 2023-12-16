import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8000/api/test/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'all', { responseType: 'text' });
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API_URL + 'user', { responseType: 'text' });
  }
  
  getModeratorBoard(): Observable<any> {
    return this.http.get(API_URL + 'mod', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API_URL + 'admin', { responseType: 'text' });
  }
  // getVendors(): Observable<any> {
  //   return this.http.get(API_URL + 'Vendor', { responseType: 'text' });
  //   // Change 'Vendor' to 'vendor' to match the backend endpoint
  // }
  getVendors(): Observable<any[]> {
    // Replace 'allVendorsEndpoint' with the actual endpoint for fetching all vendors
    const allVendorsEndpoint = 'Vendor';
    return this.http.get<any[]>(API_URL + allVendorsEndpoint);
  }
}
