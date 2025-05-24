import { Component } from '@angular/core';
import {ChatGroupComponent} from '../reusable/chat-group/chat-group.component';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-chat-page',
  imports: [
    ChatGroupComponent,
    NgForOf
  ],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css'
})
export class ChatPageComponent {
  groups = Array(5);

}
