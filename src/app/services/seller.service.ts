import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../product';

interface SellerRecord {
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
export class SellerService {

  // Railway Spring Boot backend
  private readonly baseUrl =
    'https://my-angular-tutorial-production.up.railway.app/api';

  private readonly productStorageKey = 'novacart-products';
  private readonly sellerStorageKey = 'novacart-sellers';

  constructor(private http: HttpClient) {}

  // =========================
  // SELLER LOGIN
  // =========================
  authenticateSeller(
    email: string,
    password: string
  ): Observable<{
    success: boolean;
    message: string;
    seller?: SellerRecord;
  }> {

    if (!email || !password) {
      return of({
        success: false,
        message: 'Please provide an email and password.'
      });
    }

    return new Observable((observer) => {

      this.http.post<AuthResponse>(
        `${this.baseUrl}/auth/login`,
        {
          email: email.trim().toLowerCase(),
          password: password.trim()
        }
      ).subscribe({

        next: (response) => {

          // Save JWT token
          localStorage.setItem('novacart-token', response.token);

          const seller: SellerRecord = {
            id: email,
            name: email.split('@')[0],
            email: email.trim().toLowerCase()
          };

          observer.next({
            success: true,
            message: response.message || 'Login successful.',
            seller
          });

          observer.complete();
        },

        error: (error) => {

          console.error('Login error:', error);

          observer.next({
            success: false,
            message:
              error?.error?.message ||
              'Invalid email or password.'
          });

          observer.complete();
        }
      });
    });
  }


  // =========================
  // SELLER REGISTER
  // =========================
  registerSeller(
    name: string,
    email: string,
    password: string
  ): Observable<{
    success: boolean;
    message: string;
    seller?: SellerRecord;
  }> {

    if (!name || !email || !password) {
      return of({
        success: false,
        message: 'Please provide your name, email, and password.'
      });
    }

    return new Observable((observer) => {

      this.http.post<AuthResponse>(
        `${this.baseUrl}/auth/register`,
        {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim()
        }
      ).subscribe({

        next: (response) => {

          // Save JWT token
          localStorage.setItem('novacart-token', response.token);

          const seller: SellerRecord = {
            id: email,
            name: name.trim(),
            email: email.trim().toLowerCase()
          };

          observer.next({
            success: true,
            message: response.message || 'Registration successful.',
            seller
          });

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
  // USER SIGNUP / LOGIN
  // =========================
  userSignup(
    data: Record<string, unknown>
  ): Observable<{
    success: boolean;
    message: string;
    seller?: SellerRecord;
  }> {

    const email = String(data['email'] ?? '')
      .trim()
      .toLowerCase();

    const password = String(data['password'] ?? '')
      .trim();

    const name = String(data['name'] ?? '')
      .trim();

    if (name.length > 0) {
      return this.registerSeller(name, email, password);
    }

    return this.authenticateSeller(email, password);
  }


  // =========================
  // PRODUCTS
  // =========================

  addProduct(data: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.baseUrl}/products`,
      data
    );
  }


  updateProduct(
    id: number,
    data: Product
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.baseUrl}/products/${id}`,
      data
    );
  }


  deleteProduct(id: number): Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/products/${id}`
    );
  }


  productList(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.baseUrl}/products`
    );
  }


  // =========================
  // OLD LOCAL STORAGE METHODS
  // =========================

  private generateId(): string {
    return Math.random()
      .toString(36)
      .slice(2, 10);
  }


  private readProducts(): Product[] {

    if (typeof window === 'undefined') {
      return this.seedProducts();
    }

    const stored =
      localStorage.getItem(this.productStorageKey);

    if (!stored) {
      const seed = this.seedProducts();
      this.persistProducts(seed);
      return seed;
    }

    try {
      return JSON.parse(stored) as Product[];
    } catch {
      return this.seedProducts();
    }
  }


  private persistProducts(products: Product[]): void {

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.productStorageKey,
      JSON.stringify(products)
    );
  }


  private readSellers(): SellerRecord[] {

    if (typeof window === 'undefined') {
      return this.seedSellers();
    }

    const stored =
      localStorage.getItem(this.sellerStorageKey);

    if (!stored) {
      const seed = this.seedSellers();
      this.persistSellers(seed);
      return seed;
    }

    try {
      return JSON.parse(stored) as SellerRecord[];
    } catch {
      return this.seedSellers();
    }
  }


  private persistSellers(
    sellers: SellerRecord[]
  ): void {

    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(
      this.sellerStorageKey,
      JSON.stringify(sellers)
    );
  }


  private seedProducts(): Product[] {

    return [
      {
        id: 1,
        name: 'Noise Smart Watch',
        description:
          'Smart fitness tracking with a vivid display and long battery life.',
        category: 'Electronics',
        price: 89,
        stock: 15,
        imageUrl:
          'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 2,
        name: 'Aurora Headphones',
        description:
          'Immersive sound with premium comfort for daily listening.',
        category: 'Electronics',
        price: 129,
        stock: 20,
        imageUrl:
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 3,
        name: 'Luma Lamp',
        description:
          'Minimal lighting for modern interiors and cozy evenings.',
        category: 'Home',
        price: 59,
        stock: 12,
        imageUrl:
          'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 4,
        name: 'Eco Tote Bag',
        description:
          'A durable everyday bag designed for casual errands and travel.',
        category: 'Fashion',
        price: 34,
        stock: 30,
        imageUrl:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 5,
        name: 'Glow Blender',
        description:
          'High-speed blending with a sleek finish for daily smoothies.',
        category: 'Home',
        price: 72,
        stock: 8,
        imageUrl:
          'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 6,
        name: 'Zen Chair',
        description:
          'Comfortable ergonomic seating crafted for modern spaces.',
        category: 'Home',
        price: 149,
        stock: 5,
        imageUrl:
          'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80'
      }
    ];
  }


  private seedSellers(): SellerRecord[] {

    return [
      {
        id: 'seed-1',
        name: 'Samruddhi Shete',
        email: 'samruddhi123@gmail.com',
        password: 'abc@123'
      },
      {
        id: 'seed-2',
        name: 'Raj Sharma',
        email: 'raj123@gmail.com',
        password: 'abc@123'
      }
    ];
  }
}