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
    MovieTime:0,
    ShowTime: [{ date: '', hours: '' , endTime:''}],
    published: false
  };
  submitted = false;

  constructor(private tutorialService: TutorialService) {}

  saveTutorial(): void {
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description,
      MovieTime:this.tutorial.MovieTime,
      ShowTime: this.tutorial.ShowTime ?? []
    };

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
      },
      error: (e) => console.error(e)
    });
  }

addShowTime() {
    this.tutorial.ShowTime = this.tutorial.ShowTime ?? [];
    this.tutorial.ShowTime.push({ date: '', hours: '', endTime:'' });
  }

  newTutorial(): void {
    this.submitted = false;
    this.tutorial = {
      title: '',
      description: '',
      MovieTime:0,
      ShowTime:  [{ date: '', hours: '', endTime:'' }],
      published: false,
    };
  }

  deleteShowTime(): void {
    if (this.tutorial.ShowTime && this.tutorial.ShowTime.length > 0) {
      this.tutorial.ShowTime.pop();
    }
  }
}
