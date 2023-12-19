// tutorials-list-cust.component.ts
import { Component, OnInit } from '@angular/core';
import { Tutorial } from 'src/app/models/tutorial.model';
import { UserService } from 'src/app/_services/user.service';
import { TutorialService } from 'src/app/_services/tutorial.service';
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { environment } from "src/environments/environment";

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list-cust.component.html',
  styleUrls: ['./tutorials-list-cust.component.css'],
})
export class TutorialsListComponentCust implements OnInit {
  selectedVendor: any;
  tutorials?: Tutorial[];
  movies?: any[]; // Add property for movies
  vendors?: any[];
  currentTutorial: Tutorial = {};
  currentVendor: any = {};
  currentIndex = -1;
  currentIndexVendor = -1;
  title = '';
 
  // message:any = null;
  constructor(
    private tutorialService: TutorialService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.retrieveVendors();
    // this.requestPermission();
    //  this.listen();
  }

  
  // requestPermission() {

  //   const messaging = getMessaging();

  //   getToken(messaging, { vapidKey: environment.firebase.vapidKey }).then((currentToken) => {
  //     if (currentToken) {
  //       console.log("token",currentToken)
  //       // Send the token to your server and update the UI if necessary
  //       // ...
  //     } else {
  //       // Show permission request UI
  //       console.log('No registration token available. Request permission to generate one.');
  //       // ...
  //     }
  //   }).catch((err) => {
  //     console.log('An error occurred while retrieving token. ', err);
  //     // ...
  //   });

  // }
  // listen() {
  //   const messaging = getMessaging();
  //   onMessage(messaging, (payload) => {
  //     console.log('Message received. ', payload);
  //     this.message=payload;
  //   });
  // }

  retrieveTutorials(): void {
    // Check if a vendor is selected
    if (this.selectedVendor) {
      console.log('vendor Id :',this.selectedVendor);
      // Retrieve tutorials based on the selected vendor's ID
      this.tutorialService.findPublishedByVendorID(this.selectedVendor).subscribe({
        next: (data) => {
          this.tutorials = data;
          console.log(data);
        },
        error: (e) => console.error(e),
      });
      

      // Retrieve movies based on the selected vendor's ID
    }
  }

  retrieveVendors(): void {
    this.userService.getVendors().subscribe({
      next: (data) => {
        console.log('Vendors data:', data);
        if (data && data.length > 0) {
          console.log('First Vendor:', data[0]);
        }
        this.vendors = data;
      },
      error: (e) => console.error('Error retrieving vendors:', e),
    });
  }

  refreshList(): void {
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
    this.retrieveTutorials(); // Call retrieveTutorials when a vendor is selected
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

  onVendorChange() {
    // Access the selected vendor's ID using this.selectedVendor
    const selectedVendorId = this.selectedVendor;

    // Now you can use the selectedVendorId as needed, for example:
    console.log('Selected Vendor ID:', selectedVendorId);

    // If you want to perform actions based on the selected vendor's ID, you can do that here.
    // For example, you might want to load tutorials and movies associated with the selected vendor.
    this.retrieveTutorials();

    // Reset the tutorial-related properties
    this.currentTutorial = {};
    this.currentIndex = -1;
  }
}
