import { Component, OnInit } from '@angular/core';
import { Cinema } from 'src/app/models/cinema.model';
import { CinemaService } from 'src/app/_services/cinema.service';

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

  constructor(private cinemaService: CinemaService) {}

  ngOnInit(): void {
    this.retrieveCinemas();
  }

  retrieveCinemas(): void {
    this.cinemaService.getAll().subscribe({
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
    this.cinemaService.deleteAll().subscribe({
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