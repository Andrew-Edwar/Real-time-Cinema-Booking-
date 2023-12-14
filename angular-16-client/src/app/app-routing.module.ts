import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { TutorialsListComponent } from './tutorials-list/tutorials-list.component';
import { CinemasListComponent } from './cinemas-list/cinemas-list.component';
import { TutorialsListComponentCust } from './tutorials-list-cust/tutorials-list-cust.component';
import { AddTutorialComponent } from './add-tutorial/add-tutorial.component';
import { AddCinemaComponent } from './add-cinema/add-cinema.component';
import { TutorialDetailsComponent } from './tutorial-details/tutorial-details.component';
import { TutorialDetailsComponentCust } from './tutorial-details-cust/tutorial-details-cust.component';
const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: BoardUserComponent },
  { path: 'add', component: AddTutorialComponent },
  { path: 'addcinema', component: AddCinemaComponent },
  { path: 'tutorials', component: TutorialsListComponent },
  { path: 'cinemas', component: CinemasListComponent },
  { path: 'tutorialsCust', component: TutorialsListComponentCust },
  { path: 'tutorialsCust/:id', component: TutorialDetailsComponentCust },
  { path: 'tutorials/:id', component: TutorialDetailsComponent },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
