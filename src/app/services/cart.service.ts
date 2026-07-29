import { Injectable, signal } from '@angular/core';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
  quantity: number;
}

export interface ProductLike {
  id: number;
  name: string;
  price: number;
  image: string;
  category?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  readonly items = signal<CartItem[]>(this.readFromStorage());
  readonly cartCount = signal(this.items().reduce((sum, item) => sum + item.quantity, 0));

  addToCart(product: ProductLike): void {
    const existing = this.items().find((item) => item.id === product.id);

    if (existing) {
      this.items.update((current) => current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      this.items.update((current) => [...current, { ...product, quantity: 1 }]);
    }

    this.persist();
    this.cartCount.set(this.items().reduce((sum, item) => sum + item.quantity, 0));
  }

  increaseQuantity(id: number): void {
    this.items.update((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    this.persist();
    this.cartCount.set(this.items().reduce((sum, item) => sum + item.quantity, 0));
  }

  decreaseQuantity(id: number): void {
    this.items.update((current) => current.flatMap((item) => {
      if (item.id !== id) {
        return [item];
      }

      if (item.quantity <= 1) {
        return [];
      }

      return [{ ...item, quantity: item.quantity - 1 }];
    }));
    this.persist();
    this.cartCount.set(this.items().reduce((sum, item) => sum + item.quantity, 0));
  }

  removeItem(id: number): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
    this.persist();
    this.cartCount.set(this.items().reduce((sum, item) => sum + item.quantity, 0));
  }

  clearCart(): void {
    this.items.set([]);
    this.persist();
    this.cartCount.set(0);
  }

  private persist(): void {
    localStorage.setItem('novacart-cart', JSON.stringify(this.items()));
  }

  private readFromStorage(): CartItem[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem('novacart-cart');
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  }
}
