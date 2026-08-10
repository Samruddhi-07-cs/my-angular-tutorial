import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { SellerService, AuthResponse } from './seller.service';

export interface SellerUser {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly currentUser =
    signal<SellerUser | null>(this.readFromStorage());

  readonly isAuthenticated =
    signal(Boolean(this.currentUser()));

  constructor(
    private sellerService: SellerService,
    private router: Router
  ) {}

  // =========================
  // LOGIN
  // =========================
  login(
    email: string,
    password: string
  ): Observable<{
    success: boolean;
    message: string;
  }> {

    return this.sellerService
      .authenticateSeller(email, password)
      .pipe(

        map((response: AuthResponse) => {

          if (response && response.token) {

            const user: SellerUser = {
              id: email,
              name: email.split('@')[0],
              email: email
            };

            this.setCurrentUser(user);

            // Save JWT token
            localStorage.setItem(
              'novacart-token',
              response.token
            );

            return {
              success: true,
              message: response.message ||
                'Login successful.'
            };
          }

          this.clearSession();

          return {
            success: false,
            message: response?.message ||
              'Login failed.'
          };
        }),

        catchError((error) => {

          console.error('Login error:', error);

          this.clearSession();

          return of({
            success: false,
            message:
              error?.error?.message ||
              'Unable to login. Please check your email and password.'
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
  ): Observable<{
    success: boolean;
    message: string;
  }> {

    return this.sellerService
      .registerSeller(name, email, password)
      .pipe(

        map((response: AuthResponse) => {

          console.log('Registration response:', response);

          if (response && response.token) {

            const user: SellerUser = {
              id: email,
              name: name,
              email: email
            };

            this.setCurrentUser(user);

            // Save JWT token
            localStorage.setItem(
              'novacart-token',
              response.token
            );

            return {
              success: true,
              message: response.message ||
                'Registration successful.'
            };
          }

          this.clearSession();

          return {
            success: false,
            message: response?.message ||
              'Registration failed.'
          };
        }),

        catchError((error) => {

          console.error(
            'Registration error:',
            error
          );

          this.clearSession();

          return of({
            success: false,
            message:
              error?.error?.message ||
              'Registration failed.'
          });
        })
      );
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {

    this.clearSession();

    localStorage.removeItem(
      'novacart-token'
    );

    this.router.navigate(['/']);
  }

  // =========================
  // SET USER
  // =========================
  private setCurrentUser(
    user: SellerUser
  ): void {

    this.currentUser.set(user);
    this.isAuthenticated.set(true);

    localStorage.setItem(
      'novacart-auth-user',
      JSON.stringify(user)
    );
  }

  // =========================
  // CLEAR SESSION
  // =========================
  private clearSession(): void {

    this.currentUser.set(null);
    this.isAuthenticated.set(false);

    localStorage.removeItem(
      'novacart-auth-user'
    );
  }

  // =========================
  // READ USER
  // =========================
  private readFromStorage(): SellerUser | null {

    if (typeof window === 'undefined') {
      return null;
    }

    const stored =
      localStorage.getItem(
        'novacart-auth-user'
      );

    if (!stored) {
      return null;
    }

    try {

      return JSON.parse(
        stored
      ) as SellerUser;

    } catch {

      return null;
    }
  }
}