import { Routes } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {LoginComponent} from './components/registration/login/login.component';
import {SignUpPageComponent} from './components/registration/sign-up-page/sign-up-page.component';
import {TreksPageComponent} from './components/treks-page/treks-page.component';
import {ProblemMapComponent} from './components/problem-map/problem-map.component';
import {TrekInfoPageComponent} from './components/trek-info-page/trek-info-page.component';
import {ProfilePageComponent} from './components/profile-page/profile-page.component';
import {ChatPageComponent} from './components/chat-page/chat-page.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpPageComponent},
  {path: 'treks', component: TreksPageComponent},
  {path: 'problems-map', component: ProblemMapComponent},
  {path: 'trek-info', component: TrekInfoPageComponent},
  {path: 'profile', component: ProfilePageComponent},
  {path: 'trek-chat', component: ChatPageComponent},
];
