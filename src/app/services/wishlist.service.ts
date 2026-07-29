import { Injectable, signal } from '@angular/core';
import { ProductLike } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  readonly items = signal<ProductLike[]>(this.readFromStorage());

  addToWishlist(product: ProductLike): void {
    if (this.items().some((item) => item.id === product.id)) {
      return;
    }

    this.items.update((current) => [...current, product]);
    this.persist();
  }

  removeFromWishlist(id: number): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
    this.persist();
  }

  toggleWishlist(product: ProductLike): boolean {
    if (this.isInWishlist(product.id)) {
      this.removeFromWishlist(product.id);
      return false;
    }

    this.addToWishlist(product);
    return true;
  }

  isInWishlist(id: number): boolean {
    return this.items().some((item) => item.id === id);
  }

  clearWishlist(): void {
    this.items.set([]);
    this.persist();
  }

  private persist(): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem('novacart-wishlist', JSON.stringify(this.items()));
  }

  private readFromStorage(): ProductLike[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const stored = localStorage.getItem('novacart-wishlist');
    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as ProductLike[];
    } catch {
      return [];
    }
  }
}
