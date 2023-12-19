import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { StorageService } from '../_services/storage.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css'],
})
export class TutorialsListComponent {
  tutorials?: Tutorial[];
  currentTutorial: Tutorial = {};
  currentIndex = -1;
  title = '';
  message:any = null;
  constructor(private tutorialService: TutorialService,private storageService: StorageService) {}

  ngOnInit(): void {
    this.retrieveTutorials();
    this.requestPermission();
    this.listen();
  }
  requestPermission() {

    const messaging = getMessaging();

    getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
      if (currentToken) {
        console.log("token",currentToken)
        // Send the token to your server and update the UI if necessary
        // ...
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });

  }

  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }
  currentUser = this.storageService.getUser();
  retrieveTutorials(): void {
    this.tutorialService.findByVendorID(this.currentUser.id).subscribe({
      next: (data) => {
        this.tutorials = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }

  refreshList(): void {
    this.retrieveTutorials();
    this.currentTutorial = {};
    this.currentIndex = -1;
  }

  setActiveTutorial(tutorial: Tutorial, index: number): void {
    this.currentTutorial = tutorial;
    this.currentIndex = index;
  }

  removeAllTutorials(): void {
    this.tutorialService.deleteAllByVendorID(this.currentUser.id).subscribe({
      next: (res) => {
        console.log(res);
        this.refreshList();
      },
      error: (e) => console.error(e)
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
      error: (e) => console.error(e)
    });
  }
}