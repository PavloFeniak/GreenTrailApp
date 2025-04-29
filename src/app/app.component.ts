import { Component } from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GreenTrailApp';
  isRegistrationPage: boolean = false;
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRegistrationPage = event.url.includes('/login') || event.url.includes('/sign-up');
      }
    });
    document.body.style.margin = "0";
  }
}
