// map-marker.component.ts
// import { AgmInfoWindow } from '@agm/core';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.css']
})
export class MapMarkerComponent implements OnInit {

  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow | undefined;

  constructor(private cinemaService: CinemaService) {}

  ngOnInit(): void {
    this.fetchAndDisplayAllCinemas();
  }
  
  center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = {draggable: false};
  markerPositions: google.maps.LatLngLiteral[] = [];
  cinemas?: Cinema[];

  fetchAndDisplayAllCinemas(): void {
    this.cinemaService.getAll().subscribe(
      (cinemas) => {
        this.cinemas = cinemas;
        this.markerPositions = [];

        // Iterate through cinemas and add markers to the map
        this.cinemas.forEach((cinema) => {
          cinema.locations?.forEach((location) => {
            const latLng: google.maps.LatLngLiteral = {
              lat: location.latitude,
              lng: location.longitude,
            };
            this.markerPositions.push(latLng);
          });
        });
      },
      (error) => {
        console.error('Error fetching cinemas:', error);
      }
    );
  }

  openInfoWindow(marker: MapMarker) {
    if(this.infoWindow != undefined)
    this.infoWindow.open(marker);
  }
}