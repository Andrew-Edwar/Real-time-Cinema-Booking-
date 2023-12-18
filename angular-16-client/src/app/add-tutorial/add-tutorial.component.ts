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
    ShowTime: [{ date: '', hours: '', endTime: '' }],
    published: false,
    cinemas: [], // Added cinemas property
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
    this.loadCinemas();
  }

  loadCinemas(): void {
    this.cinemaService.getAll().subscribe(
      (data) => {
        this.cinemas = data;

        // Assuming currentTutorial has the cinema IDs, map them to the cinema objects
        this.tutorial.cinemas = this.tutorial.cinemas?.map(cinemaId => {
          return this.cinemas.find(cinema => cinema.id === cinemaId) || { id: cinemaId, name: 'Unknown Cinema' };
        });
      },
      (error) => {
        console.error('Error loading cinemas:', error);
      }
    );
  }

  saveTutorial(): void {
    this.titleExists = false;
    this.movieTimeError = false;
    this.oldShowTime = false;
    this.hourError = false;

    const currentUser = this.storageService.getUser();
  
    if (!currentUser) {
      // Handle user not found
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
        const showTimeDate = new Date(
          showtime?.date + ' ' + showtime?.hours
        );
        return showTimeDate < currentTime || showTimeDate < minimumTime;
      });
  
      if (invalidShowTime) {
        console.log(
          'Showtime should be at least 6 hours from the current time.'
        );
        this.hourError = true;
        return;
      }
  
      if (this.tutorial.MovieTime as number < 0 || this.tutorial.MovieTime as number > 240) {
        console.log(
          'Please enter a positive number for MovieTime and ensure it is less than or equal to 240.'
        );
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
      const selectedCinemas = (this.tutorial.cinemas || []).map((cinema) => cinema.id);
  
      // Add cinemas to the data object
      const data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        MovieTime: this.tutorial.MovieTime,
        ShowTime: this.tutorial.ShowTime ?? [],
        cinemas: selectedCinemas ??[],
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

  cinemaCheckboxChanged(cinema: Cinema): void {
    console.log('Checkbox changed for cinema:', cinema);
    const isCinemaSelected = this.isCinemaSelected(cinema);
    console.log('Is cinema selected?', isCinemaSelected);
  

    if (isCinemaSelected) {
      // If cinema is selected, remove it
      this.tutorial.cinemas = (this.tutorial.cinemas || []).filter(c => c.id !== cinema.id);
    } else {
      // If cinema is not selected, add it
      this.tutorial.cinemas = [...(this.tutorial.cinemas || []), cinema];
    }
  }

  isCinemaSelected(cinema: Cinema): boolean {
    return this.tutorial.cinemas?.some((c) => c.id === cinema.id) ?? false;
  }
  
  // Existing methods...

  addShowTime() {
    this.tutorial.ShowTime = this.tutorial.ShowTime ?? [];
    this.tutorial.ShowTime.push({ date: '', hours: '', endTime: '' });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      MovieTime: 0,
      ShowTime: [{ date: '', hours: '', endTime: '' }],
      cinemas: [],
      published: false,
      vendorID:''
    };
  }

  deleteShowTime(): void {
    if (this.tutorial.ShowTime && this.tutorial.ShowTime.length > 0) {
      this.tutorial.ShowTime.pop();
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
