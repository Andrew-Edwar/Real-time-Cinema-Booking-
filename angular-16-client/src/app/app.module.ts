import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { TutorialsListComponent } from './tutorials-list/tutorials-list.component';
import { CinemasListComponent } from './cinemas-list/cinemas-list.component';
import { TutorialsListComponentCust } from './tutorials-list-cust/tutorials-list-cust.component';
import { AddTutorialComponent } from './add-tutorial/add-tutorial.component';
import { AddBookingComponent } from './add-booking/add-booking.component';
import { AddCinemaComponent } from './add-cinema/add-cinema.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { TutorialDetailsComponentCust } from './tutorial-details-cust/tutorial-details-cust.component';
import { TutorialDetailsComponent } from './tutorial-details/tutorial-details.component';
import { MapMarker } from '@angular/google-maps';
import { MapMarkerComponent } from './map-marker/map-marker.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    BoardAdminComponent,
    BoardModeratorComponent,
    BoardUserComponent,
    TutorialsListComponent,
    AddTutorialComponent,
    TutorialDetailsComponent,
    CinemasListComponent,
    TutorialDetailsComponentCust,
    TutorialsListComponentCust,
    AddCinemaComponent,
    MapMarkerComponent,
    AddBookingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    GoogleMapsModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
