import { AfterViewInit,Component, Input, OnInit,ChangeDetectorRef  } from '@angular/core';
import { TutorialService } from 'src/app/_services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Tutorial } from 'src/app/models/tutorial.model';
import { BookingService } from 'src/app/_services/booking.service';
import { Booking } from '../models/booking.model';
import { StorageService } from '../_services/storage.service';
import { TutorialsListComponentCust } from '../tutorials-list-cust/tutorials-list-cust.component';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-tutorial-details-cust',
  templateUrl: './tutorial-details-cust.component.html',
  styleUrls: ['./tutorial-details-cust.component.css'],
})
export class TutorialDetailsComponentCust implements OnInit {
  selectedSeats: number[] = [];
  movieSelect: any;


  // Function to toggle seat selection
  toggleSeatSelection(event: any, rowIndex: number, seatIndex: number): void {
    const target = event.target;
    if (target.classList.contains('seat') && !target.classList.contains('sold')) {
      // Toggle selected class
      target.classList.toggle('selected');
  
      // Update selected seats array
      const seatNumber = this.getSeatNumber(rowIndex, seatIndex)-1;
      const isSelected = this.selectedSeats.includes(seatNumber);
    
      if (!isSelected) {
        // Add to selected seats
        this.selectedSeats.push(seatNumber);
      } else {
        // Remove from selected seats
        const indexToRemove = this.selectedSeats.indexOf(seatNumber);
        if (indexToRemove !== -1) {
          this.selectedSeats.splice(indexToRemove, 1);
        }
      }
  
      // Manually trigger change detection
      this.cdRef.detectChanges();
      
      // Update count and total
      this.updateSelectedCount();
    }
  }
  
  // Update total and count
  updateSelectedCount(): void {
    const selectedSeatsCount = this.selectedSeats.length;
  
    // Access selected seats count in your template using selectedSeatsCount
    // ...
  
    // Update other logic as needed
  
    this.setMovieData(this.movieSelect.selectedIndex, this.movieSelect.value);
  }
  setMovieData(selectedIndex: number, value: any): void {
    if (this.movieSelect) {
      // Ensure that this.movieSelect is defined
      // Access selected index and value here
      console.log('Selected Index:', selectedIndex);
      console.log('Selected Value:', value);
    }
  }
  getSeatNumber(row: number, seat: number): number {
    const seatsPerRow = 8; // Change this to the actual number of seats in each row
    return row * seatsPerRow + seat +1;
  }
  
  
  @Input() viewMode = false;

  booking: Booking = {
    CustomerID: '',
    MovieID: '',
    ShowTime:{date:'',hours:'',endTime:'',selectedSeats:[]},
    vendorID:'',
    cinemaID:'',
    
  };

  @Input() currentTutorial: Tutorial = {
    title: '',
    description: '',
    MovieTime: 0,
    ShowTime: [{ date: '', hours: '', endTime: '' ,    totalBookedSeats: 0, // Initialize with the total booked seats
    bookedSeats: []}],
    published: true,
    
  };

  selectedShowTime: any = { date: '', hours: '', endTime: '', selectedSeats: [] };



  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private storageService: StorageService,
    private cinemaService: CinemaService,
    private cdRef: ChangeDetectorRef  // Inject ChangeDetectorRef


  ) {}

  cinemas: Cinema[] = [];
  loadCinemas(): void {
    this.cinemaService.getAll().subscribe(
      (data) => {
        console.log('All cinemas data:', data);
        // Assuming currentTutorial has an array of cinema IDs
        if (this.currentTutorial && this.currentTutorial.cinemas) {
          // Create an empty array to store the cinemas by ID
          const cinemaIds = this.currentTutorial.cinemas;
          this.cinemas = [];
  
          // Loop through each cinema ID and fetch the cinema details
          cinemaIds.forEach(cinemaId => {
            this.cinemaService.get(cinemaId).subscribe(
              (cinema) => {
                console.log('Fetched cinema:', cinema);
                this.cinemas.push(cinema);  // Add the fetched cinema to the array
              },
              (error) => {
                console.error('Error loading cinema by ID:', error);
              }
            );
          });
        }
      },
      (error) => {
        console.error('Error loading cinemas:', error);
      }
    );
  }
  

  selectedCinema: Cinema | undefined;
  onCinemaSelected(cinema: Cinema): void {
    this.selectedCinema = cinema;
  }

  ngOnInit(): void {
    this.message = '';
    this.getTutorial(this.route.snapshot.params['id']);
    this.loadCinemas();
  }

  submitted = false;

  saveBooking(): void {
    console.log(this.booking);
    const currentUser = this.storageService.getUser();
    const { date, hours, endTime } = this.selectedShowTime;
  
    if (!this.selectedCinema) {
      console.error('Please select a cinema.');
      return;
    }
  
    const selectedMovieElement = document.getElementById('movie') as HTMLSelectElement;
    const selectedMovieIndex = selectedMovieElement.selectedIndex;
    const selectedMovieValue = selectedMovieElement.value;
  
    // Map selected seat indices to seat numbers
    const selectedSeatsNumbers = this.selectedSeats.map(seatIndex =>
      this.getSeatNumber(Math.floor(seatIndex / 8), seatIndex % 8)
    );
  
    // Find the corresponding ShowTime in currentTutorial and add the new booked seats
    const selectedShowTime = this.currentTutorial.ShowTime?.find(
      showTime => showTime.date === date && showTime.hours === hours && showTime.endTime === endTime
    );
  
    if (selectedShowTime) {
      // Add the new booked seats to the existing ones
      selectedShowTime.totalBookedSeats = (selectedShowTime.totalBookedSeats || 0) + selectedSeatsNumbers.length;
      selectedShowTime.bookedSeats = (selectedShowTime.bookedSeats || []).concat(selectedSeatsNumbers);
    } else {
      // Create a new ShowTime entry if it doesn't exist
      const newShowTimeEntry = {
        date: date,
        hours: hours,
        endTime: endTime,
        totalBookedSeats: selectedSeatsNumbers.length,
        bookedSeats: selectedSeatsNumbers,
      };
      this.currentTutorial.ShowTime?.push(newShowTimeEntry);
    }
  
    const data: Booking = {
      CustomerID: currentUser.id,
      MovieID: this.currentTutorial.id,
      ShowTime: {
        date: date,
        hours: hours,
        endTime: endTime,
        selectedSeats: selectedSeatsNumbers,
      },
      vendorID: this.currentTutorial.vendorID,
      cinemaID: this.selectedCinema.id,
      selectedMovieIndex: selectedMovieIndex,
      selectedMovieValue: selectedMovieValue,
    };
  
    console.log('Data to be saved:', data);
  
    // Update the Tutorial in the database
    this.tutorialService.update(this.currentTutorial.id, this.currentTutorial).subscribe({
      next: (res) => {
        console.log('Tutorial updated successfully:', res);
      },
      error: (e) => console.error('Error updating tutorial:', e),
    });
  
    // Create the Booking in the database
    this.bookingService.create(data).subscribe({
      next: (res) => {
        console.log('Booking saved successfully:', res);
        this.submitted = true;
      },
      error: (e) => console.error('Error saving booking:', e),
    });
  }
  
  

  newBooking(): void {
    this.submitted = false;
    this.booking = {
      CustomerID: '',
      MovieID: '',
      ShowTime:{date:'',hours:'',endTime:''},
      vendorID:'',
      cinemaID:''
    };
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
        (showTime) => showTime.date === date && showTime.hours == hour
      );
    }
    return undefined;
  }

  // Function to handle the selected showtime
  onShowTimeSelected(): void {
    if (this.selectedShowTime) {
      console.log('Selected Show Time:', this.selectedShowTime);
      // Additional actions based on the selected showtime can be added here
    }
  }

  isSeatSold(row: number, seat: number): boolean {
    const seatNumber = this.getSeatNumber(row, seat) ;
    const selectedShowTime = this.getSelectedShowTime(); // Implement this method to get the selected showtime
    return selectedShowTime?.bookedSeats?.includes(seatNumber) || false;
  }
  
  getSelectedShowTime(): any {
    // Implement this method to get the selected showtime based on your logic
    return this.currentTutorial.ShowTime?.find(
      (showTime) =>
        showTime.date === this.selectedShowTime.date &&
        showTime.hours === this.selectedShowTime.hours &&
        showTime.endTime === this.selectedShowTime.endTime
    );
  }
  
  
}