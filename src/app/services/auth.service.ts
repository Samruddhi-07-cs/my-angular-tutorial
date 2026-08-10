import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  ): Observable<{ success: boolean; message: string }> {

    return new Observable(observer => {

      this.sellerService
        .authenticateSeller(email, password)
        .subscribe({

          next: (response: AuthResponse) => {

            if (response && response.token) {

              localStorage.setItem(
                'novacart-token',
                response.token
              );

              const user: SellerUser = {
                id: '',
                name: email.split('@')[0],
                email: email
              };

              this.setCurrentUser(user);

              observer.next({
                success: true,
                message: response.message || 'Login successful.'
              });

            } else {

              observer.next({
                success: false,
                message: response?.message || 'Login failed.'
              });
            }

            observer.complete();
          },

          error: (error) => {

            console.error('Login error:', error);

            observer.next({
              success: false,
              message:
                error?.error?.message ||
                'Unable to login. Please check your email and password.'
            });

            observer.complete();
          }

        });
    });
  }

  // =========================
  // REGISTER
  // =========================
  register(
    name: string,
    email: string,
    password: string
  ): Observable<{ success: boolean; message: string }> {

    return new Observable(observer => {

      this.sellerService
        .registerSeller(name, email, password)
        .subscribe({

          next: (response: AuthResponse) => {

            if (response && response.token) {

              // Save JWT token
              localStorage.setItem(
                'novacart-token',
                response.token
              );

              const user: SellerUser = {
                id: '',
                name: name,
                email: email
              };

              this.setCurrentUser(user);

              observer.next({
                success: true,
                message:
                  response.message ||
                  'Registration successful.'
              });

            } else {

              observer.next({
                success: false,
                message:
                  response?.message ||
                  'Registration failed.'
              });
            }

            observer.complete();
          },

          error: (error) => {

            console.error('Registration error:', error);

            observer.next({
              success: false,
              message:
                error?.error?.message ||
                'Registration failed.'
            });

            observer.complete();
          }

        });
    });
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
  // SET USER
  // =========================
  private setCurrentUser(user: SellerUser): void {

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

    localStorage.removeItem('novacart-auth-user');
  }

  // =========================
  // READ USER
  // =========================
  private readFromStorage(): SellerUser | null {

    if (typeof window === 'undefined') {
      return null;
    }

    const stored =
      localStorage.getItem('novacart-auth-user');

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