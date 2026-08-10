import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl =
    'https://my-angular-tutorial-production.up.railway.app/api/products';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('novacart-auth-token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  // GET - public
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // GET by ID - public
  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // POST - authenticated
  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      product,
      { headers: this.getHeaders() }
    );
  }

  // PUT - authenticated
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      product,
      { headers: this.getHeaders() }
    );
  }

  // DELETE - authenticated
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    );
  }
}