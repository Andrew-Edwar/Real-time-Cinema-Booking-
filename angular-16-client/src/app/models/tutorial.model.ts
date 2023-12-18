import { Cinema } from './cinema.model';

export class Tutorial {
  id?: any;
  title?: string;
  description?: string;
  published?: boolean;
  MovieTime?: number;
  ShowTime?: { date: string; hours: string; endTime: string; totalBookedSeats?: number; bookedSeats?: number[] }[] = [];
  cinemas?: Cinema[];
  vendorID?: any;
}
