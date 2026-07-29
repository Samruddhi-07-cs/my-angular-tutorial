import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ProductPayload {
  id?: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
}

interface SellerRecord {
  id: string;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private readonly baseUrl = 'http://localhost:3000';
  private readonly productStorageKey = 'novacart-products';
  private readonly sellerStorageKey = 'novacart-sellers';

  constructor(private http: HttpClient) {}

  userSignup(data: Record<string, unknown>): Observable<unknown> {
    const email = String(data['email'] ?? '').trim().toLowerCase();
    const password = String(data['password'] ?? '').trim();
    const name = String(data['name'] ?? '').trim();

    if (!email || !password) {
      return of({ success: false, message: 'Please provide an email and password.' });
    }

    const sellers = this.readSellers();
    const hasName = name.length > 0;

    if (hasName) {
      const isDuplicate = sellers.some((seller) => seller.email.toLowerCase() === email);
      if (isDuplicate) {
        return of({ success: false, message: 'An account with this email already exists.' });
      }

      const seller: SellerRecord = {
        id: this.generateId(),
        name,
        email,
        password
      };
      sellers.push(seller);
      this.persistSellers(sellers);
      return of({ success: true, message: 'Account created successfully.', seller });
    }

    const seller = sellers.find((entry) => entry.email.toLowerCase() === email && entry.password === password);
    if (seller) {
      return of({ success: true, message: 'Welcome back! You are logged in.', seller });
    }

    return of({ success: false, message: 'Invalid email or password.' });
  }

  addProduct(data: ProductPayload): Observable<unknown> {
    const products = this.readProducts();
    const product: ProductPayload = { ...data, id: data.id ?? Number(this.generateId().replace(/\D/g, '').slice(0, 6)) };
    products.push(product);
    this.persistProducts(products);
    return of(product);
  }

  updateProduct(id: number, data: ProductPayload): Observable<unknown> {
    const products = this.readProducts();
    const index = products.findIndex((product) => product.id === id);
    if (index >= 0) {
      products[index] = { ...products[index], ...data, id };
      this.persistProducts(products);
      return of(products[index]);
    }

    return of({ success: false, message: 'Product not found.' });
  }

  deleteProduct(id: number): Observable<unknown> {
    const products = this.readProducts().filter((product) => product.id !== id);
    this.persistProducts(products);
    return of({ success: true, id });
  }

  productList(): Observable<ProductPayload[]> {
    const cachedProducts = this.readProducts();
    if (cachedProducts.length) {
      return of(cachedProducts);
    }

    return this.http.get<ProductPayload[]>(`${this.baseUrl}/products`).pipe(
      catchError(() => of(this.readProducts()))
    );
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2, 10);
  }

  private readProducts(): ProductPayload[] {
    if (typeof window === 'undefined') {
      return this.seedProducts();
    }

    const stored = localStorage.getItem(this.productStorageKey);
    if (!stored) {
      const seed = this.seedProducts();
      this.persistProducts(seed);
      return seed;
    }

    try {
      return JSON.parse(stored) as ProductPayload[];
    } catch {
      return this.seedProducts();
    }
  }

  private persistProducts(products: ProductPayload[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.productStorageKey, JSON.stringify(products));
  }

  private readSellers(): SellerRecord[] {
    if (typeof window === 'undefined') {
      return this.seedSellers();
    }

    const stored = localStorage.getItem(this.sellerStorageKey);
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

  private persistSellers(sellers: SellerRecord[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.sellerStorageKey, JSON.stringify(sellers));
  }

  private seedProducts(): ProductPayload[] {
    return [
      {
        id: 1,
        name: 'Noise Smart Watch',
        price: 89,
        category: 'Electronics',
        color: 'Midnight',
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
        description: 'Smart fitness tracking with a vivid display and long battery life.'
      },
      {
        id: 2,
        name: 'Aurora Headphones',
        price: 129,
        category: 'Electronics',
        color: 'Silver',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
        description: 'Immersive sound with premium comfort for daily listening.'
      },
      {
        id: 3,
        name: 'Luma Lamp',
        price: 59,
        category: 'Home',
        color: 'Cream',
        image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80',
        description: 'Minimal lighting for modern interiors and cozy evenings.'
      },
      {
        id: 4,
        name: 'Eco Tote Bag',
        price: 34,
        category: 'Fashion',
        color: 'Olive',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        description: 'A durable everyday bag designed for casual errands and travel.'
      },
      {
        id: 5,
        name: 'Glow Blender',
        price: 72,
        category: 'Home',
        color: 'Black',
        image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=900&q=80',
        description: 'High-speed blending with a sleek finish for daily smoothies.'
      },
      {
        id: 6,
        name: 'Zen Chair',
        price: 149,
        category: 'Home',
        color: 'Walnut',
        image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80',
        description: 'Comfortable ergonomic seating crafted for modern spaces.'
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
