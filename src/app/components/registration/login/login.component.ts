import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  errorMessage = '';
  constructor(private router: Router,private authService: AuthService){

  }

  onLogin(){
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('JWT Token:', response.jwt);
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Wrong username or password';
      }
    });
  }

  ngOnInit(): void {
  }
  openLoginPage(){
    console.log("odehvhudsfuiisuKJBISFVBSIV")
    this.router.navigate(['/registration']);
  }
}
