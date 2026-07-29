import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../app/services/cart.service';
import { WishlistService } from '../app/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly isMenuOpen = signal(false);
  readonly cartCount = this.cartService.cartCount;
  readonly wishlistCount = this.wishlistService.items;
  readonly searchQuery = signal('');

  constructor(private cartService: CartService, private wishlistService: WishlistService, private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  goToSearch(): void {
    const term = this.searchQuery().trim();
    this.router.navigate(['/products'], { queryParams: { search: term } });
    this.closeMenu();
  }
}

