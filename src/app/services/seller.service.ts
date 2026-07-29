import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ProductPayload {
  id?: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  userSignup<T>(data: T): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/seller-signup`, data);
  }

  addProduct(data: ProductPayload): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/products`, data);
  }

  updateProduct(id: number, data: ProductPayload): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<unknown> {
    return this.http.delete(`${this.baseUrl}/products/${id}`);
  }

  productList(): Observable<ProductPayload[]> {
    return this.http.get<ProductPayload[]>(`${this.baseUrl}/products`);
  }
}
