import { Component, OnInit } from '@angular/core';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
import { StorageService } from '../_services/storage.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-add-cinema',
  templateUrl: './add-cinema.component.html',
  styleUrls: ['./add-cinema.component.css'],
  
})
export class AddCinemaComponent implements OnInit {
  cinema: Cinema = {
    name: '',
    vendorID:'',
    locations:  [{ latitude: 0, longitude: 0 }],
  };

  ngOnInit(): void {
  }

  submitted = false;
  nameExists = false;
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  
  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng != null)
    this.markerPositions.push(event.latLng.toJSON());
  }
 
  
  constructor(private cinemaService: CinemaService,
    private storageService: StorageService) {}

  saveCinema(): void {
    let existingCinemas: Cinema[];

    this.cinemaService.getAll().subscribe((existingCinemas) => {
      const isExistingName = existingCinemas.some(
        (existingCinema) => existingCinema.name === this.cinema.name
      );
  

      if (isExistingName) {
        this.nameExists = true; // Set error state to true
        return;
      }

      const locations = this.markerPositions.map((position) => ({
        latitude: position.lat,
        longitude: position.lng,
      }));

      const currentUser = this.storageService.getUser();
      const data = {
        name: this.cinema.name,
        vendorID:currentUser.id,
        locations: locations,
      };
      console.log('Data to be saved:', data);

      this.cinemaService.create(data).subscribe({
        next: (res) => {
          console.log('Cinema saved successfully:', res);
          this.submitted = true;
        },
        error: (e) => console.error('Error saving cinema:', e),
      });

      // Reset other error flags or perform any additional cleanup
      this.nameExists= false;
   

    });
  }


  newCinema(): void {
    this.submitted = false;
    this.cinema = {
      name: '',
      vendorID:''
  
    };
  }



}
