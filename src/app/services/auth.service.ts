import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { SellerService } from './seller.service';

export interface SellerUser {
  id: string;
  name: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly currentUser = signal<SellerUser | null>(this.readFromStorage());
  readonly isAuthenticated = signal(Boolean(this.currentUser()));

  constructor(private sellerService: SellerService, private router: Router) {}

  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.authenticate({ email, password });
  }

  register(name: string, email: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.authenticate({ name, email, password });
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/']);
  }

  private authenticate(payload: Record<string, unknown>): Observable<{ success: boolean; message: string }> {
    return new Observable((observer) => {
      const hasName = typeof payload['name'] === 'string' && String(payload['name']).trim().length > 0;
      const request = hasName
        ? this.sellerService.registerSeller(String(payload['name']).trim(), String(payload['email'] ?? '').trim().toLowerCase(), String(payload['password'] ?? '').trim())
        : this.sellerService.authenticateSeller(String(payload['email'] ?? '').trim().toLowerCase(), String(payload['password'] ?? '').trim());

      request.subscribe({
        next: (result) => {
          const response = result as { success?: boolean; message?: string; seller?: SellerUser } | null;
          if (response?.success && response.seller) {
            this.setCurrentUser(response.seller);
            observer.next({ success: true, message: response.message ?? 'Authentication successful.' });
          } else {
            this.clearSession();
            observer.next({ success: false, message: response?.message ?? 'Authentication failed.' });
          }
          observer.complete();
        },
        error: () => {
          this.clearSession();
          observer.next({ success: false, message: 'Unable to complete the request right now.' });
          observer.complete();
        }
      });
    });
  }

  private setCurrentUser(user: SellerUser): void {
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    this.persistUser(user);
  }

  private clearSession(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.persistUser(null);
  }

  private persistUser(user: SellerUser | null): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!user) {
      localStorage.removeItem('novacart-auth-user');
      return;
    }

    localStorage.setItem('novacart-auth-user', JSON.stringify(user));
  }

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
