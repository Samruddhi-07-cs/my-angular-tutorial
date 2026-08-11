import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Product } from '../product';

export interface AuthResponse {
  token: string;
  message: string;
}

interface SellerRecord {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private readonly baseUrl =
    'https://my-angular-tutorial-production-4383.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // =====================================================
  // GET JWT TOKEN
  // =====================================================
  private getAuthHeaders(): HttpHeaders {

    const token = localStorage.getItem('novacart-token');

    console.log('JWT token being sent:', token);

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // =====================================================
  // REGISTER
  // =====================================================
  registerSeller(
    name: string,
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/register`,
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password
      }
    );
  }

  // =====================================================
  // LOGIN
  // =====================================================
  authenticateSeller(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/login`,
      {
        email: email.trim().toLowerCase(),
        password: password
      }
    );
  }

  // =====================================================
  // USER SIGNUP / LOGIN
  // =====================================================
  userSignup(data: Record<string, unknown>): Observable<AuthResponse> {

    const email =
      String(data['email'] ?? '').trim().toLowerCase();

    const password =
      String(data['password'] ?? '').trim();

    const name =
      String(data['name'] ?? '').trim();

    if (name.length > 0) {
      return this.registerSeller(
        name,
        email,
        password
      );
    }

    return this.authenticateSeller(
      email,
      password
    );
  }

  // =====================================================
  // GET PRODUCTS - PUBLIC
  // =====================================================
  productList(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.baseUrl}/products`
    );
  }

  // =====================================================
  // ADD PRODUCT - JWT REQUIRED
  // =====================================================
  addProduct(data: Product): Observable<Product> {

    return this.http.post<Product>(
      `${this.baseUrl}/products`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // =====================================================
  // UPDATE PRODUCT - JWT REQUIRED
  // =====================================================
  updateProduct(
    id: number,
    data: Product
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.baseUrl}/products/${id}`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // =====================================================
  // DELETE PRODUCT - JWT REQUIRED
  // =====================================================
  deleteProduct(id: number): Observable<any> {

    return this.http.delete(
      `${this.baseUrl}/products/${id}`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }
}