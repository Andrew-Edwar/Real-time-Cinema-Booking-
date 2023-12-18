export class Booking {
  CustomerID?: any;
  MovieID?: any;
  ShowTime?: { date: String; hours: String; endTime: String };
  vendorID?: any;
  cinemaID?: any;
  selectedSeats?: number[] = [];
  selectedMovieIndex?: number;   // Index of the selected movie
  selectedMovieValue?: string;   // Value of the selected movie
}
