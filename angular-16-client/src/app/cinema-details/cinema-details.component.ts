import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cinema } from 'src/app/models/cinema.model';
import { CinemaService } from 'src/app/_services/cinema.service';

@Component({
  selector: 'app-cinema-details',
  templateUrl: './cinema-details.component.html',
  styleUrls: ['./cinema-details.component.css'],
})
export class CinemaDetailsComponent {
  @Input() viewMode = false;

  @Input() currentCinema: Cinema = {
    name: '',

  };

  message = '';
  constructor(
    private cinemaService: CinemaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getCinema(this.route.snapshot.params['id']);
    }
  }

  getCinema(id: string): void {
    this.cinemaService.get(id).subscribe({
      next: (data) => {
        this.currentCinema = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }


  updateCinema(): void {
    this.message = '';

    this.cinemaService
      .update(this.cinemaService.id, this.cinemaService)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.message = res.message
            ? res.message
            : 'This tutorial was updated successfully!';
        },
        error: (e) => console.error(e)
      });
  }

  deleteTutorial(): void {
    this.tutorialService.delete(this.currentTutorial.id).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e)
    });
  }
  
  addShowTime() {
    this.currentTutorial.ShowTime = this.currentTutorial.ShowTime ?? [];
    this.currentTutorial.ShowTime.push({ date: '', hours: '', endTime: '' }); 
  }
deleteShowTime(): void {
  if (this.currentTutorial.ShowTime && this.currentTutorial.ShowTime.length > 0) {
    this.currentTutorial.ShowTime.pop();
  }
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



getShowTimeByDateAndHour(date: String, hour: string): any | undefined {
  if (this.currentTutorial.ShowTime) {
    return this.currentTutorial.ShowTime.find(
      (showTime) =>
      showTime.date === date &&
      showTime.hours == hour
    );
  }
  return undefined;
}



}

  

  

