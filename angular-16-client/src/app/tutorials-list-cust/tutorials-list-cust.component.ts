// tutorials-list-cust.component.ts
import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { UserService } from 'src/app/_services/user.service';
import { TutorialService } from 'src/app/_services/tutorial.service';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list-cust.component.html',
  styleUrls: ['./tutorials-list-cust.component.css'],
})
export class TutorialsListComponentCust {
  tutorials?: Tutorial[];
  vendors?: any[];
  currentTutorial: Tutorial = {};
  currentVendor: any = {};
  currentIndex = -1;
  currentIndexVendor = -1;
  title = '';

  constructor(
    private tutorialService: TutorialService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.retrieveVendors();
  }

  retrieveTutorials(): void {
    this.tutorialService.getPublished().subscribe({
      next: (data) => {
        this.tutorials = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }

  retrieveVendors(): void {
    this.userService.getVendors().subscribe({
      next: (data) => {
        console.log('Vendors data:', data);
        this.vendors = data;
      },
      error: (e) => console.error('Error retrieving vendors:', e),
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.retrieveVendors();
    this.currentTutorial = {};
    this.currentIndex = -1;
    this.currentVendor = {};
    this.currentIndexVendor = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
    this.currentVendor = {};
    this.currentIndexVendor = -1;
  }

  setActiveVendor(vendor: any, index: number): void {
    this.currentVendor = vendor;
    this.currentIndexVendor = index;
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAll().subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e),
    });
  }

  searchTitle(): void {
    this.currentTutorial = {};
    this.currentIndex = -1;

    this.tutorialService.findByTitle(this.title).subscribe({
      next: (data) => {
        this.tutorials = data;
        console.log(data);
      },
      error: (e) => console.error(e),
    });
  }
}
