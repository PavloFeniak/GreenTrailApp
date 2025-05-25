import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthResponse} from '../DTO/auth-response.dto';
import {Router} from '@angular/router';
import {API_ENDPOINTS} from '../config/api-endpoints';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private tokenExpirationKey = 'tokenExpiration';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<{ jwt: string }>( API_ENDPOINTS.AUTH_URL + '/login', { email, password })
      .pipe(
        tap(response => {
          const token = response.jwt;
          this.setToken(token);
        })
      );
  }


  registration(email: string, password: string, phoneNumber: string, name: string, address: string): Observable<string> {
    return this.http.post(API_ENDPOINTS.AUTH_URL + '/register', {
      email,
      password,
      phoneNumber,
      name,
      address
    }, { responseType: 'text' });
  }


  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const payload = this.parseJwt(token);
    if (payload && payload.exp) {
      const expirationTime = payload.exp * 1000; // unix timestamp to ms
      localStorage.setItem(this.tokenExpirationKey, expirationTime.toString());
      this.scheduleAutoLogout();
    }
  }

  getToken(): string | null {
    if (this.isTokenExpired()) {
      this.logout();
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem(this.tokenExpirationKey);
    if (!expiration) {
      return true;
    }
    const expirationTime = Number(expiration);
    return Date.now() > expirationTime;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
    this.router.navigate(['']);
  }

  private parseJwt(token: string): any | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  private scheduleAutoLogout(): void {
    const expiration = localStorage.getItem(this.tokenExpirationKey);
    if (!expiration) {
      return;
    }
    const expiresIn = Number(expiration) - Date.now();
    if (expiresIn <= 0) {
      this.logout();
      return;
    }
    setTimeout(() => {
      this.logout();
    }, expiresIn);
  }
}
