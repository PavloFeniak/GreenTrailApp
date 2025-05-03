import { Routes } from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {HomePageComponent} from './components/home-page/home-page.component';
import {LoginComponent} from './components/registration/login/login.component';
import {SignUpPageComponent} from './components/registration/sign-up-page/sign-up-page.component';
import {TreksPageComponent} from './components/treks-page/treks-page.component';

export const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpPageComponent},
  {path: 'treks', component: TreksPageComponent}
];
