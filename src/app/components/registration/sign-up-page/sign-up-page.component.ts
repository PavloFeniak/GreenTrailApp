import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-up-page',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './sign-up-page.component.html',
  styleUrl: './sign-up-page.component.css'
})
export class SignUpPageComponent {
  email = '';
  name = '';
  address = '';
  phoneNumber = '+3801234567890';
  password = '';
  errorMessage = '';

  constructor(private router: Router, private authService: AuthService) {
  }

  registration() {
    this.authService.registration(this.email, this.password, this.phoneNumber, this.name, this.address).subscribe({
      next: (response) => {
        console.log('Server response:', response); // response === "User registered"
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    });
  }

  openLoginPage(){
    this.router.navigate(['/login']);
  }
}
