import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  readonly items = signal<CartItem[]>([
    { id: 1, name: 'Noise Smart Watch', price: 89, quantity: 1, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80' },
    { id: 2, name: 'Aurora Headphones', price: 129, quantity: 2, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80' }
  ]);

  readonly coupon = signal('');

  get subtotal(): number {
    return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get gst(): number {
    return this.subtotal * 0.12;
  }

  get shipping(): number {
    return this.subtotal > 0 ? 25 : 0;
  }

  get discount(): number {
    return this.coupon().toLowerCase() === 'save10' ? this.subtotal * 0.1 : 0;
  }

  get total(): number {
    return this.subtotal + this.gst + this.shipping - this.discount;
  }

  increaseQuantity(id: number): void {
    this.items.update((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  }

  decreaseQuantity(id: number): void {
    this.items.update((current) => current.map((item) => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  }

  removeItem(id: number): void {
    this.items.update((current) => current.filter((item) => item.id !== id));
  }

  applyCoupon(): void {
    if (!this.coupon().trim()) {
      return;
    }
  }
}
