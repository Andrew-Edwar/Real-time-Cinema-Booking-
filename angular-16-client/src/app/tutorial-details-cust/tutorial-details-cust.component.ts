import { Component, Input, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { BookingService } from 'src/app/_services/booking.service';
import { Booking } from '../models/booking.model';
import { StorageService } from '../_services/storage.service';
import { TutorialsListComponentCust } from '../tutorials-list-cust/tutorials-list-cust.component';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
@Component({
  selector: 'app-tutorial-details-cust',
  templateUrl: './tutorial-details-cust.component.html',
  styleUrls: ['./tutorial-details-cust.component.css'],
})
export class TutorialDetailsComponentCust implements OnInit {
  @Input() viewMode = false;

  booking: Booking = {
    CustomerID: '',
    MovieID: '',
    ShowTime:{date:'',hours:'',endTime:''},
    vendorID:'',
    cinemaID:''
  };

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    MovieTime: 0,
    ShowTime: [{ date: '', hours: '', endTime: '' }],
    published: true,
  };

  selectedShowTime: any = { date: '', hours: '', endTime: '' };


  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private storageService: StorageService,
    private cinemaService: CinemaService,

  ) {}

  cinemas: Cinema[] = [];
  loadCinemas(): void {
    this.cinemaService.getAll().subscribe(
      (data) => {
        this.cinemas = data;

        // Assuming currentTutorial has the cinema IDs, map them to the cinema objects
        this.currentTutorial.cinemas = this.currentTutorial.cinemas?.map(cinemaId => {
          return this.cinemas.find(cinema => cinema.id === cinemaId) || { id: cinemaId, name: 'Unknown Cinema' };
        });
        console.error('data cinemas:', data);
      },
      (error) => {
        console.error('Error loading cinemas:', error);
      }
    );
  }

  selectedCinema: Cinema | undefined;
  onCinemaSelected(cinema: Cinema): void {
    this.selectedCinema = cinema;
  }

  ngOnInit(): void {
    this.message = '';
    this.getTutorial(this.route.snapshot.params['id']);
    this.loadCinemas();
  }

  submitted = false;

  saveBooking(): void {
    const currentUser = this.storageService.getUser();
    const { date, hours, endTime } = this.selectedShowTime;
    if (!this.selectedCinema) {
      console.error('Please select a cinema.');
      return;
    }
  
    const data = {
      CustomerID: currentUser.id,
      MovieID: this.currentTutorial.id,
      ShowTime: {
        date: date,
        hours: hours,
        endTime: endTime
      },
      vendorID:this.currentTutorial.vendorID,
      cinemaID: this.selectedCinema.id,
    };

    console.log('Data to be saved:', data);

    this.bookingService.create(data).subscribe({
      next: (res) => {
        console.log('Booking saved successfully:', res);
        this.submitted = true;
      },
      error: (e) => console.error('Error saving booking:', e),
    });
  }

  newBooking(): void {
    this.submitted = false;
    this.booking = {
      CustomerID: '',
      MovieID: '',
      ShowTime:{date:'',hours:'',endTime:''},
      vendorID:'',
      cinemaID:''
    };
  }

  getTutorial(id: string): void {
    this.tutorialService.get(id).subscribe({
      next: (data) => {
        this.currentTutorial = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  getShowTimeByDateAndHour(date: String, hour: string): any | undefined {
    if (this.currentTutorial.ShowTime) {
      return this.currentTutorial.ShowTime.find(
        (showTime) => showTime.date === date && showTime.hours == hour
      );
    }
    return undefined;
  }

  // Function to handle the selected showtime
  onShowTimeSelected(): void {
    if (this.selectedShowTime) {
      console.log('Selected Show Time:', this.selectedShowTime);
      // Additional actions based on the selected showtime can be added here
    }
  }
}
