import { Cinema } from './cinema.model';

export class Tutorial {
  id?: any;
  title?: string;
  description?: string;
  published?: boolean;
  MovieTime?: number;
  ShowTime?: {
    date: string;
    hours: string;
    endTime: string;
    cinema?: Cinema | string; // Allows associating a Cinema object or its ID with a ShowTime
    totalBookedSeats?: number;
    bookedSeats?: number[];
  }[] = []; // Each ShowTime entry can now reference a cinema
  // cinemas?: Cinema[]; // List of cinemas linked to the tutorial
  vendorID?: any;
}
