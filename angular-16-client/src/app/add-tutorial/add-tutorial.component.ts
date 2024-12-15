import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css'],
})
export class AddTutorialComponent implements OnInit {

  tutorial: Tutorial = {
    title: '',
    description: '',
    MovieTime: 0,
    ShowTime: [{ date: '', hours: '', endTime: '', cinema: '' }], 
    published: false,
    vendorID: '',
  }; 
  
  submitted = false;
  titleExists = false;
  movieTimeError = false;
  oldShowTime = false;
  hourError = false;

  cinemas: Cinema[] = [];

  constructor(
    private tutorialService: TutorialService,
    private cinemaService: CinemaService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadCinemasByVendorID();
  }

  loadCinemasByVendorID(): void {
    const currentUser = this.storageService.getUser();
    if (!currentUser || !currentUser.id) {
      console.error('Error: User not found or vendor ID missing.');
      return;
    }

    const vendorID = currentUser.id; // Get vendor ID from the logged-in user
    this.cinemaService.findByVendorID(vendorID).subscribe(
      (data) => {
        this.cinemas = data;
        console.log('Cinemas loaded for vendor:', this.cinemas);

        // Map cinema IDs in the tutorial to their full objects
        
      },
      (error) => {
        console.error('Error loading cinemas for vendor:', error);
      }
    );
  }
  // Save tutorial method
saveTutorial(): void {
  this.titleExists = false;
  this.movieTimeError = false;
  this.oldShowTime = false;
  this.hourError = false;

  const currentUser = this.storageService.getUser();
  if (!currentUser) {
    return;
  }

  this.tutorialService.getAll().subscribe((existingTutorials) => {
    const isExistingTitle = existingTutorials.some(
      (existingTutorial) => existingTutorial.title === this.tutorial.title
    );

    if (isExistingTitle) {
      this.titleExists = true;
      return;
    }

    const currentTime = new Date();
    const minimumTime = new Date();
    minimumTime.setHours(minimumTime.getHours() + 6);

    const invalidShowTime = this.tutorial.ShowTime?.some((showtime) => {
      const showTimeDate = new Date(showtime?.date + ' ' + showtime?.hours);
      return showTimeDate < currentTime || showTimeDate < minimumTime;
    });

    if (invalidShowTime) {
      console.log('Showtime should be at least 6 hours from the current time.');
      this.hourError = true;
      return;
    }

    if (this.tutorial.MovieTime as number < 0 || this.tutorial.MovieTime as number > 240) {
      console.log('Please enter a positive number for MovieTime and ensure it is less than or equal to 240.');
      this.movieTimeError = true;
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (
      this.tutorial.ShowTime &&
      this.tutorial.ShowTime.some(
        (showtime) => showtime?.date && showtime.date < today
      )
    ) {
      console.log('Showtime date cannot be before today.');
      this.oldShowTime = true;
      return;
    }

    const selectedCinemas = this.tutorial.ShowTime?.map(showTime => showTime.cinema);

    // Add cinemas to the data object
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description,
      MovieTime: this.tutorial.MovieTime,
      ShowTime: this.tutorial.ShowTime?.map(showTime => ({
        date: showTime.date,
        hours: showTime.hours,
        endTime: showTime.endTime,
        cinema: showTime.cinema, // Ensure cinema ID is included
      })),
      vendorID: currentUser.id
    };

    console.log('Data to be saved:', data);

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log('Tutorial saved successfully:', res);
        this.submitted = true;
      },
      error: (e) => console.error('Error saving tutorial:', e),
    });
  });
}



  

    
  
  // Existing methods...

  addShowTime() {
    this.tutorial.ShowTime = this.tutorial.ShowTime ?? [];
    this.tutorial.ShowTime.push({ date: '', hours: '', endTime: '', cinema: ''  });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      MovieTime: 0,
      ShowTime: [{ date: '', hours: '', endTime: '', cinema: '' }],
      published: false,
      vendorID:''
    };
  }

  deleteShowTime(index: number): void {
    if (this.tutorial.ShowTime && this.tutorial.ShowTime.length > 0) {
      this.tutorial.ShowTime.splice(index, 1);  // Remove the ShowTime at the given index
    }
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
