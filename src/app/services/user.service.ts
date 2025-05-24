import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {API_ENDPOINTS} from '../config/api-endpoints';
import {UserResponseDTO} from '../DTO/user-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token = localStorage.getItem('authToken');

  constructor(private http: HttpClient, private router: Router) {
  }

  getUserByEmail(): Observable<UserResponseDTO> {

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<UserResponseDTO>(API_ENDPOINTS.USER_URL + '/email', {
      headers
    });
  }
}
