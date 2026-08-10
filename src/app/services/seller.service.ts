import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product';

export interface SellerRecord {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {

  // Spring Boot Railway backend
  private readonly baseUrl =
    'https://my-angular-tutorial-production.up.railway.app/api';

  constructor(private http: HttpClient) {}

  // =========================
  // SELLER REGISTER
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
  // SELLER LOGIN
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
  // USER SIGNUP
  // =========================
  userSignup(
    data: Record<string, unknown>
  ): Observable<AuthResponse> {

    const name =
      String(data['name'] ?? '').trim();

    const email =
      String(data['email'] ?? '')
        .trim()
        .toLowerCase();

    const password =
      String(data['password'] ?? '');

    return this.registerSeller(
      name,
      email,
      password
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
      data
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
      data
    );
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  deleteProduct(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.baseUrl}/products/${id}`
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
}