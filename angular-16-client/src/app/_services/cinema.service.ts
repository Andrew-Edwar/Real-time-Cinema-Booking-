import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cinema } from '../models/cinema.model';
import { map } from 'rxjs/operators';

const baseUrl = 'http://localhost:8000/api/cinemas';

interface GraphQLResponse {
  data: {
    cinemas: Cinema[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class CinemaService {
  constructor(private http: HttpClient) {}
  private graphqlUrl = 'http://localhost:8000/graphql';

  getAll(): Observable<Cinema[]> {
    const query = `
      query {
        cinemas {
          id
          name
          vendorID
          locations {
            latitude
            longitude
          }
        }
      }
    `;
    
    const payload = {
      query: query
    };

    return this.http.post<GraphQLResponse>(this.graphqlUrl, payload).pipe(
      map(response => response.data.cinemas) // map the response to return only the cinemas
    );
  }

  getPublished(): Observable<Cinema[]> {
    return this.http.get<Cinema[]>(`${baseUrl}/published`);
  }


  get(id: any): Observable<Cinema> {
    return this.http.get<Cinema>(`${baseUrl}/${id}`);
  }
  

 create(data: { name?: string; vendorID: string; locations: { latitude: number; longitude: number }[] }): Observable<any> {
    const mutation = `
      mutation AddCinema($name: String!, $vendorID: String!, $locations: [LocationInput!]) {
        addCinema(name: $name, vendorID: $vendorID, locations: $locations) {
          id
          name
          vendorID
          locations {
            latitude
            longitude
          }
        }
      }
    `;

    const payload = {
      query: mutation,
      variables: {
        name: data.name ,
        vendorID: data.vendorID,
        locations: data.locations,
      },
    };

    return this.http.post<any>(this.graphqlUrl, payload);
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
