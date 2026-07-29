import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent {
  readonly items = this.wishlistService.items;

  constructor(private wishlistService: WishlistService, private cartService: CartService) {}

  addToCart(id: number): void {
    const selected = this.items().find((item) => item.id === id);
    if (!selected) {
      return;
    }

    this.cartService.addToCart(selected);
  }

  removeFromWishlist(id: number): void {
    this.wishlistService.removeFromWishlist(id);
  }
}
