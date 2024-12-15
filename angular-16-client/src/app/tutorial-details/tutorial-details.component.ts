import { Component, Input } from '@angular/core';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css'],
})
export class TutorialDetailsComponent {
  @Input() viewMode = false;
  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    MovieTime: 0,
    ShowTime: [{ date: '', hours: '', endTime: '', cinema: '' }],
    published: true,
  };
  message = '';
  cinemas: Cinema[] = [];
  hourError = false;
  oldShowTime = false;
  movieTimeError = false;
  titleExists = false;

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router,
    private cinemaService: CinemaService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.message = '';
    this.getTutorial(this.route.snapshot.params['id']);
    this.loadCinemas();
  }

  loadCinemas(): void {
    const currentUser = this.storageService.getUser();
    if (!currentUser || !currentUser.id) {
      console.error('Error: User not found or vendor ID missing.');
      return;
    }

    const vendorID = currentUser.id;
    this.cinemaService.findByVendorID(vendorID).subscribe(
      (data) => {
        this.cinemas = data;
        console.log('Cinemas loaded for vendor:', this.cinemas);
      },
      (error) => {
        console.error('Error loading cinemas for vendor:', error);
      }
    );
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

  updatePublished(status: boolean): void {
    if (status && (!this.currentTutorial.MovieTime || this.hasEmptyShowTime())) {
      this.message = 'Please provide MovieTime and ensure all ShowTimes have valid Date and Time before publishing.';
      return;
    }

    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      ShowTime: this.prepareShowTime(),
      MovieTime: this.currentTutorial.MovieTime,
      published: status,
    };

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        this.currentTutorial.published = status;
        this.message = res.message ? res.message : 'The status was updated successfully!';
      },
      error: (e) => console.error(e),
    });
  }

  updateTutorial(): void {
    this.message = '';

    if (this.hasInvalidShowTime()) {
      return;
    }

    const data = {
      title: this.currentTutorial.title,
      description: this.currentTutorial.description,
      ShowTime: this.prepareShowTime(),
      MovieTime: this.currentTutorial.MovieTime,
      published: this.currentTutorial.published,
    };

    this.message = '';

    this.tutorialService.update(this.currentTutorial.id, data).subscribe({
      next: (res) => {
        this.message = res.message ? res.message : 'This tutorial was updated successfully!';
      },
      error: (e) => {
        console.error(e);
      },
    });

    this.hourError = false;
    this.oldShowTime = false;
    this.movieTimeError = false;
    this.titleExists = false;
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e),
    });
  }

  addShowTime(): void {
    this.currentTutorial.ShowTime = this.currentTutorial.ShowTime ?? [];
    this.currentTutorial.ShowTime.push({ date: '', hours: '', endTime: '', cinema: '' });
  }

  deleteShowTime(): void {
    if (this.currentTutorial.ShowTime && this.currentTutorial.ShowTime.length > 0) {
      this.currentTutorial.ShowTime.pop();
    }
  }

  hasInvalidShowTime(): boolean {
    const currentTime = new Date();
    const minimumTime = new Date();
    minimumTime.setHours(minimumTime.getHours() + 6);

    if (
      this.currentTutorial.ShowTime &&
      this.currentTutorial.ShowTime.some((showtime) => {
        const showTimeDate = new Date(showtime?.date + ' ' + showtime?.hours);
        return showTimeDate < currentTime || showTimeDate < minimumTime;
      })
    ) {
      this.hourError = true;
      return true;
    }

    const today = new Date().toISOString().split('T')[0];
    if (
      this.currentTutorial.ShowTime &&
      this.currentTutorial.ShowTime.some((showtime) => showtime?.date && showtime.date < today)
    ) {
      this.oldShowTime = true;
      return true;
    }

    if (this.currentTutorial.MovieTime as number < 0 || this.currentTutorial.MovieTime as number > 240) {
      this.movieTimeError = true;
      return true;
    }

    return false;
  }

  private hasEmptyShowTime(): boolean {
    return (
      !!this.currentTutorial.ShowTime &&
      this.currentTutorial.ShowTime.some(
        (showTime) =>
          !showTime.date || showTime.date.trim() === '' || !showTime.hours || showTime.hours.trim() === ''
      )
    );
  }

  private prepareShowTime() {
    return (
      this.currentTutorial.ShowTime?.map((show) => ({
        date: show.date,
        hours: show.hours,
        cinema: show.cinema,
        totalBookedSeats: show.totalBookedSeats || 0,
        bookedSeats: show.bookedSeats || [],
      })) || []
    );
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

    getCinemaName(cinemaId: string | Cinema | undefined): string {
      if (typeof cinemaId === 'string') {
        const cinema = this.cinemas.find(c => c.id === cinemaId);
        return cinema ? (cinema.name || 'No cinema selected') : 'No cinema selected';
      } else if (cinemaId && cinemaId.name) {
        return cinemaId.name || 'No cinema selected'; // Ensure fallback if name is undefined
      }
      return 'No cinema selected';
    }
  
  
  
}
