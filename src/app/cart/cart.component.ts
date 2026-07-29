import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, CartItem } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  readonly items = this.cartService.items;
  readonly coupon = signal('');
  readonly message = signal<string | null>(null);

  constructor(private cartService: CartService) {}

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
    this.cartService.increaseQuantity(id);
  }

  decreaseQuantity(id: number): void {
    this.cartService.decreaseQuantity(id);
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
  }

  applyCoupon(): void {
    const code = this.coupon().trim().toLowerCase();
    if (!code) {
      this.message.set('Enter a coupon code to continue.');
      return;
    }

    if (code === 'save10') {
      this.message.set('Coupon applied successfully.');
      return;
    }

    this.message.set('That coupon code is invalid.');
  }

  checkout(): void {
    if (!this.items().length) {
      this.message.set('Your cart is empty. Add a product before checkout.');
      return;
    }

    this.message.set('Checkout is ready. Your order will be processed shortly.');
  }
}

