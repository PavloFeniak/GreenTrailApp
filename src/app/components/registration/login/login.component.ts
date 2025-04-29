import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  constructor(private router: Router,private userService: UserService){

  }

  login(){
    this.userService.login();
  }

  ngOnInit(): void {
  }
  openLoginPage(){
    console.log("odehvhudsfuiisuKJBISFVBSIV")
    this.router.navigate(['/registration']);
  }
}
