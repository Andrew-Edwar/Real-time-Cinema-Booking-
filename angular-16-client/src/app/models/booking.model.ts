export class Booking {
  CustomerID?: any;
  MovieID?: any;
  ShowTime?: { date: String; hours: String; endTime: String ;selectedSeats?: number[];};
  vendorID?: any;
  cinemaID?: any;
  selectedMovieIndex?: number;   // Index of the selected movie
  selectedMovieValue?: string;   // Value of the selected movie
}
