import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {API_ENDPOINTS} from '../config/api-endpoints';
import {UserResponseDTO} from '../DTO/user-response.dto';
import {TrekParticipantResponseDto} from '../DTO/trek-participant-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token = localStorage.getItem('authToken');

  constructor(private http: HttpClient, private router: Router) {
  }

  getSelfByEmail(): Observable<UserResponseDTO> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<UserResponseDTO>(API_ENDPOINTS.USER_URL + '/email', {
      headers
    });
  }
  getUserByEmail(email: string): Observable<UserResponseDTO> {
    const params = new HttpParams().set('email', email);
    return this.http.get<UserResponseDTO>(API_ENDPOINTS.USER_URL + '/user-by-email', {params});
  }

  getUserParticipation(): Observable<TrekParticipantResponseDto[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<TrekParticipantResponseDto[]>(API_ENDPOINTS.TREK_URL + '/participants/user/participation', { headers });
  }
}
