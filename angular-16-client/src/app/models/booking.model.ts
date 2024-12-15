export class Booking {
  CustomerID?: string; // Reference to a User
  MovieID?: string;    // Reference to a Movie (tutorial)
  vendorID?: string;   // Reference to a Vendor (User)
  ShowTime?: Array<{
    date: string;
    hours: string;
    endTime: string;
    selectedSeats?: number[]; // Array of selected seat indices
    cinema?: string;          // Reference to a Cinema
  }>;
  selectedMovieIndex?: number; // Index of the selected movie
  selectedMovieValue?: string; // Value of the selected movie
}
