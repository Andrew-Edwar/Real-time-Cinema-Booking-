import { Component, OnInit } from '@angular/core';
import { Cinema } from 'src/app/models/cinema.model';
import { CinemaService } from 'src/app/_services/cinema.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-cineams-list',
  templateUrl: './cinemas-list.component.html',
  styleUrls: ['./cinemas-list.component.css'],
})
export class CinemasListComponent {
  cinemas?: Cinema[];
  currentCinema: Cinema = {};
  currentIndex = -1;
  name = '';

  constructor(private cinemaService: CinemaService,private storageService: StorageService) {}

  ngOnInit(): void {
    this.retrieveCinemas();
  }
  currentUser = this.storageService.getUser();
  
  retrieveCinemas(): void {
    this.cinemaService.findByVendorID(this.currentUser.id).subscribe({
      next: (data) => {
        this.cinemas = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveCinemas();
    this.currentCinema = {};
    this.currentIndex = -1;
  }

  setActiveCinema(cinema: Cinema, index: number): void {
    this.currentCinema = cinema;
    this.currentIndex = index;
  }

  removeAllCinemas(): void {
    this.cinemaService.deleteAllByVendorID(this.currentUser.id).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }

  searchName(): void {
    this.currentCinema = {};
    this.currentIndex = -1;

    this.cinemaService.findByName(this.name).subscribe({
      next: (data) => {
        this.cinemas = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
}