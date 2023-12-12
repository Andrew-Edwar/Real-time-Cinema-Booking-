import { Component, Input } from '@angular/core';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';

@Component({
  selector: 'app-tutorial-details-cust',
  templateUrl: './tutorial-details-cust.component.html',
  styleUrls: ['./tutorial-details-cust.component.css'],
})
export class TutorialDetailsComponentCust {
  @Input() viewMode = false;

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    MovieTime: 0,
    ShowTime: [{ date: '', hours: '', endTime: '' }],
    published: true,
  };

  message = '';
  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }
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
      (showTime) =>
      showTime.date === date &&
      showTime.hours == hour
    );
  }
  return undefined;
}



}

  

  

