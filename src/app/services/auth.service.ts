import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface SellerUser {
  id: string;
  name: string;
  email: string;
  password?: string;
}

interface AuthResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Your Railway Spring Boot backend
  private apiUrl = 'https://my-angular-tutorial-production.up.railway.app/api/auth';

  readonly currentUser = signal<SellerUser | null>(this.readFromStorage());

  readonly isAuthenticated = signal(Boolean(this.currentUser()));

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =========================
  // LOGIN
  // =========================
  login(
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string }> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      {
        email: email.trim().toLowerCase(),
        password: password.trim()
      }
    ).pipe(

      map((response) => {

        if (response && response.token) {

          const user: SellerUser = {
            id: '',
            name: '',
            email: email.trim().toLowerCase()
          };

          // Save JWT token
          localStorage.setItem('novacart-token', response.token);

          // Save user
          this.setCurrentUser(user);

          return {
            success: true,
            message: response.message || 'Login Successful'
          };
        }

        return {
          success: false,
          message: 'Login failed.'
        };
      }),

      catchError((error) => {

        console.error('Login error:', error);

        this.clearSession();

        return of({
          success: false,
          message: error?.error?.message || 'Invalid email or password.'
        });
      })
    );
  }


  // =========================
  // REGISTER
  // =========================
  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string }> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim()
      }
    ).pipe(

      map((response) => {

        if (response && response.token) {

          const user: SellerUser = {
            id: '',
            name: name.trim(),
            email: email.trim().toLowerCase()
          };

          // Save JWT token
          localStorage.setItem('novacart-token', response.token);

          // Save user
          this.setCurrentUser(user);

          return {
            success: true,
            message: response.message || 'Registration Successful'
          };
        }

        return {
          success: false,
          message: 'Registration failed.'
        };
      }),

      catchError((error) => {

        console.error('Registration error:', error);

        this.clearSession();

        return of({
          success: false,
          message: error?.error?.message || 'Registration failed.'
        });
      })
    );
  }


  // =========================
  // LOGOUT
  // =========================
  logout(): void {

    localStorage.removeItem('novacart-token');

    this.clearSession();

    this.router.navigate(['/']);
  }


  // =========================
  // GET JWT TOKEN
  // =========================
  getToken(): string | null {

    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('novacart-token');
  }


  // =========================
  // SET CURRENT USER
  // =========================
  private setCurrentUser(user: SellerUser): void {

    this.currentUser.set(user);

    this.isAuthenticated.set(true);

    this.persistUser(user);
  }


  // =========================
  // CLEAR SESSION
  // =========================
  private clearSession(): void {

    this.currentUser.set(null);

    this.isAuthenticated.set(false);

    this.persistUser(null);
  }


  // =========================
  // SAVE USER
  // =========================
  private persistUser(user: SellerUser | null): void {

    if (typeof window === 'undefined') {
      return;
    }

    if (!user) {

      localStorage.removeItem('novacart-auth-user');

      return;
    }

    localStorage.setItem(
      'novacart-auth-user',
      JSON.stringify(user)
    );
  }


  // =========================
  // READ USER
  // =========================
  private readFromStorage(): SellerUser | null {

    if (typeof window === 'undefined') {
      return null;
    }

    const stored = localStorage.getItem('novacart-auth-user');

    if (!stored) {
      return null;
    }

    try {

      return JSON.parse(stored) as SellerUser;

    } catch {

      return null;
    }
  }
}