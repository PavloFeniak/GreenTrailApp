import {Component, Input, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {TrekRequestDto} from '../../DTO/trek-request.dto';
import {CommonModule} from '@angular/common';
import {TruncatePipe} from '../../shared/pipe/tunicate.pipe';
import {HttpClient} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {UserResponseDTO} from '../../DTO/user-response.dto';

@Component({
  selector: 'app-trek-preview',
  standalone: true,
  imports: [CommonModule, TruncatePipe, RouterLink],
  templateUrl: './trek-preview.component.html',
  styleUrl: './trek-preview.component.css'
})
export class TrekPreviewComponent implements OnInit {
  @Input() trek!: TrekRequestDto;
  public user!: UserResponseDTO;

  constructor(private http: HttpClient, private userService:UserService) { }

  ngOnInit(): void {
    this.userService.getUserByEmail(this.trek.createdBy).subscribe({
      next: (user: UserResponseDTO) => {
        console.log('User data:', user);
        this.user = user;
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      }
    });

  }


}
