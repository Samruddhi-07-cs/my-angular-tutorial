import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl =
    'https://novacart-api-nlq8.onrender.com/api/products';

  constructor(private http: HttpClient) {}

  // =========================================================
  // GET AUTHENTICATION HEADERS
  // =========================================================
  private getHeaders(): HttpHeaders {

    const token = localStorage.getItem('novacart-token');

    console.log('JWT token being sent:', token);

    return new HttpHeaders({
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`
          }
        : {})
    });
  }

  // =========================================================
  // GET ALL PRODUCTS - PUBLIC
  // =========================================================
  getProducts(): Observable<Product[]> {

    return this.http.get<Product[]>(
      this.apiUrl
    );
  }

  // =========================================================
  // GET PRODUCT BY ID - PUBLIC
  // =========================================================
  getProduct(id: number): Observable<Product> {

    return this.http.get<Product>(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================================================
  // ADD PRODUCT - AUTHENTICATED
  // =========================================================
  addProduct(product: Product): Observable<Product> {

    return this.http.post<Product>(
      this.apiUrl,
      product,
      {
        headers: this.getHeaders()
      }
    );
  }

  // =========================================================
  // UPDATE PRODUCT - AUTHENTICATED
  // =========================================================
  updateProduct(
    id: number,
    product: Product
  ): Observable<Product> {

    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      product,
      {
        headers: this.getHeaders()
      }
    );
  }

  // =========================================================
  // DELETE PRODUCT - AUTHENTICATED
  // =========================================================
  deleteProduct(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }
}