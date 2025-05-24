import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    RouterLink
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  constructor(private router: Router, private userService: AuthService) {
  }

  registration(){
    this.userService.registration();
  }

  openLoginPage(){
    console.log("odehvhudsfuiisuKJBISFVBSIV")
    this.router.navigate(['/login']);
  }
}
