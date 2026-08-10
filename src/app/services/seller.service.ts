import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product';

export interface AuthResponse {
  message: string;
  token: string;
}

export interface SellerRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  private readonly baseUrl =
    'https://my-angular-tutorial-production.up.railway.app/api';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // REGISTER SELLER
  // =========================
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

  // =========================
  // LOGIN SELLER
  // =========================
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

  // =========================
  // ADD PRODUCT
  // =========================
  addProduct(
    data: Product
  ): Observable<Product> {

    return this.http.post<Product>(
      `${this.baseUrl}/products`,
      data,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // =========================
  // UPDATE PRODUCT
  // =========================
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

  // =========================
  // DELETE PRODUCT
  // =========================
  deleteProduct(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/products/${id}`,
      {
        headers: this.getAuthHeaders()
      }
    );
  }

  // =========================
  // GET PRODUCTS
  // =========================
  productList(): Observable<Product[]> {

    return this.http.get<Product[]>(
      `${this.baseUrl}/products`
    );
  }

  // =========================
  // JWT HEADER
  // =========================
  private getAuthHeaders() {

    const token =
      localStorage.getItem('novacart-token');

    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}