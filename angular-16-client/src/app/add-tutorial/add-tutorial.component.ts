import { Component } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/_services/tutorial.service';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css'],
})
export class AddTutorialComponent {
  tutorial: Tutorial = {
    title: '',
    description: '',
    MovieTime: 0,
    ShowTime: [{ date: '', hours: '', endTime: '' }],
    published: false,
  };

  submitted = false;
  titleExists = false;
  movieTimeError = false;
  oldShowTime = false;
  hourError = false;

  constructor(private tutorialService: TutorialService) {}

  saveTutorial(): void {
    let existingTutorials: Tutorial[];
  
    this.tutorialService.getAll().subscribe((existingTutorials) => {
      const isExistingTitle = existingTutorials.some(
        (existingTutorial) => existingTutorial.title === this.tutorial.title
      );
  
      if (
        this.tutorial.ShowTime &&
        this.tutorial.ShowTime.some(
          (showtime) => {
            const currentTime = new Date();
            const minimumTime = new Date();
            minimumTime.setHours(minimumTime.getHours() + 6);
  
            const showTimeDate = new Date(showtime?.date + ' ' + showtime?.hours);
            return showTimeDate < currentTime || showTimeDate < minimumTime;
          }
        )
      ) {
        console.log('Showtime should be at least 6 hours from the current time.');
        this.hourError = true;
        // Open the time error dialog
  
        return;
      }
  
      if (isExistingTitle) {
        this.titleExists = true; // Set error state to true
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
        this.tutorial.ShowTime.some((showtime) => showtime?.date && showtime.date < today)
      ) {
        console.log('Showtime date cannot be before today.');
        this.oldShowTime = true;
        // Set any additional error flags or handle the error as needed
        return;
      }
  
      const data = {
        title: this.tutorial.title,
        description: this.tutorial.description,
        MovieTime: this.tutorial.MovieTime,
        ShowTime: this.tutorial.ShowTime ?? [],
      };
  
      this.tutorialService.create(data).subscribe({
        next: (res) => {
          console.log('Tutorial saved successfully:', res);
          this.submitted = true;
        },
        error: (e) => console.error('Error saving tutorial:', e),
      });
  
      // Reset other error flags or perform any additional cleanup
      this.titleExists = false;
      this.movieTimeError = false;
      this.oldShowTime = false;
      this.hourError = false;
    });
  }
  
  isShowtimeValid(selectedTime: string, currentTime: string, minimumTime: string): boolean {
    const selectedDate = new Date(`2000-01-01T${selectedTime}`);
    const currentDate = new Date(`2000-01-01T${currentTime}`);
    const minimumAllowedDate = new Date(`2000-01-01T${minimumTime}`);
  
    return selectedDate >= minimumAllowedDate && selectedDate >= currentDate;
  }
  
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
      published: false,
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