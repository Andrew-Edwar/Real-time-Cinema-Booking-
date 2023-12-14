import { Component } from '@angular/core';
import { CinemaService } from 'src/app/_services/cinema.service';
import { Cinema } from '../models/cinema.model';

@Component({
  selector: 'app-add-cinema',
  templateUrl: './add-cinema.component.html',
  styleUrls: ['./add-cinema.component.css'],
})
export class AddCinemaComponent {
  cinema: Cinema = {
    name: '',

  };

  submitted = false;
  nameExists = false;
 

  constructor(private cinemaService: CinemaService) {}

  saveCinema(): void {
    let existingCinemas: Cinema[];

    this.cinemaService.getAll().subscribe((existingCinemas) => {
      const isExistingName = existingCinemas.some(
        (existingCinema) => existingCinema.name === this.cinema.name
      );
  

      if (isExistingName) {
        this.nameExists = true; // Set error state to true
        return;
      }

      const data = {
        name: this.cinema.name,
      };

      this.cinemaService.create(data).subscribe({
        next: (res) => {
          console.log('Cinema saved successfully:', res);
          this.submitted = true;
        },
        error: (e) => console.error('Error saving cinema:', e),
      });

      // Reset other error flags or perform any additional cleanup
      this.nameExists= false;
   

    });
  }


  newCinema(): void {
    this.submitted = false;
    this.cinema = {
      name: '',
  
    };
  }



}
