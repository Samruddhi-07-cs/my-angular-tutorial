import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product';

export interface AuthResponse {
  message: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {

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

    const data: RegisterRequest = {
      name,
      email,
      password
    };

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/register`,
      data
    );
  }

  // =========================
  // SELLER LOGIN
  // =========================
  authenticateSeller(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    const data: LoginRequest = {
      email,
      password
    };

    return this.http.post<AuthResponse>(
      `${this.baseUrl}/auth/login`,
      data
    );
  }

  // =========================
  // ADD PRODUCT
  // =========================
  addProduct(data: Product): Observable<Product> {
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
  deleteProduct(id: number): Observable<void> {

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