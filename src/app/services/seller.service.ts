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
  // REGISTER SELLER
  // =========================
  registerSeller(
    name: string,
    email: string,
    password: string
  ): Observable<any> {

    const data = {
      name: name,
      email: email,
      password: password
    };

    return this.http.post(
      `${this.baseUrl}/auth/register`,
      data
    );
  }

  // =========================
  // LOGIN SELLER
  // =========================
  authenticateSeller(
    email: string,
    password: string
  ): Observable<any> {

    const data = {
      email: email,
      password: password
    };

    return this.http.post(
      `${this.baseUrl}/auth/login`,
      data
    );
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
}