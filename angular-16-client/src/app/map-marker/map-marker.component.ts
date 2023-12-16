// map-marker.component.ts

import { Component, OnInit, ViewChild } from '@angular/core';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.css']
})
export class MapMarkerComponent implements OnInit {

  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow | undefined;

  constructor(private cinemaService: CinemaService) {}

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 4;
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositionsAndNames: { position: google.maps.LatLngLiteral, name: any }[] = [];
  cinemas?: Cinema[];
  selectedMarkerContent: string | undefined;

  ngOnInit(): void {
    this.fetchAndDisplayAllCinemas();
  }

  fetchAndDisplayAllCinemas(): void {
    this.cinemaService.getAll().subscribe(
      (cinemas) => {
        this.cinemas = cinemas;
        this.markerPositionsAndNames = [];

        // Iterate through cinemas and add markers to the map
        this.cinemas.forEach((cinema) => {
          cinema.locations?.forEach((location) => {
            const latLng: google.maps.LatLngLiteral = {
              lat: location.latitude,
              lng: location.longitude,
            };
            this.markerPositionsAndNames.push({ position: latLng, name: cinema.name });
          });
        });
      },
      (error) => {
        console.error('Error fetching cinemas:', error);
      }
    );
  }

  openInfoWindow(marker: MapMarker, content: string) {
    this.selectedMarkerContent = content;
    if (this.infoWindow != undefined) {
      this.infoWindow.open(marker);
    }
  }
}
