import { Cinema } from './cinema.model';

export class Tutorial {
  id?: any;
  title?: string;
  description?: string;
  published?: boolean;
  MovieTime?: Number;
  ShowTime?: { date: String; hours: String ; endTime: String }[]=[];
  cinemas?: Cinema[];
  vendorID?: any;

}
