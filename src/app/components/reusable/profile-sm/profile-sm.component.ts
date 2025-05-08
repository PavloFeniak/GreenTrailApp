import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-profile-sm',
  imports: [
    NgClass
  ],
  templateUrl: './profile-sm.component.html',
  styleUrl: './profile-sm.component.css'
})
export class ProfileSmComponent {
 @Input() userSmBack: boolean = true;
}
