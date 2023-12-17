import { Component, OnInit } from '@angular/core';
import { BookingService } from 'src/app/_services/booking.service';
import { Booking } from '../models/booking.model';
import { StorageService } from '../_services/storage.service';
import { TutorialsListComponentCust } from '../tutorials-list-cust/tutorials-list-cust.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-booking',
  templateUrl: './add-booking.component.html',
  styleUrls: ['./add-booking.component.css'],
  
})
export class AddBookingComponent implements OnInit {
  booking: Booking = {
   
    CustomerID:'',
 
  };
 
  ngOnInit(): void {
  
  }


  submitted = false;
 
  constructor(private bookingService: BookingService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private TLC: TutorialsListComponentCust)
     {}

     selectedShowTime: any; 
     
     onShowTimeSelected(): void {
       if (this.selectedShowTime) {
         console.log('Selected Show Time:', this.selectedShowTime);
         // Do additional actions as needed
       }
     }

  saveBooking(): void {
      const currentUser = this.storageService.getUser();
      const data = {
        vendorID: this.TLC.selectedVendor,
        CustomerID:currentUser.id,
        
      };
      console.log('Data to be saved:', data);

      this.bookingService.create(data).subscribe({
        next: (res) => {
          console.log('booking saved successfully:', res);
          this.submitted = true;
        },
        error: (e) => console.error('Error saving booking:', e),
      });

  }


  newBooking(): void {
    this.submitted = false;
    this.booking = {

    CustomerID:'',
    };
  }



}
