import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../product';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

interface Category {
  name: string;
  icon: string;
  description: string;
}

interface ProductCard extends Product {
  tag: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private cartService: CartService, private wishlistService: WishlistService, private router: Router) {}
  readonly heroSlides = [
    {
      title: 'Discover exciting deals',
      subtitle: 'Shop premium gadgets, fashion and daily essentials with irresistible offers.',
      badge: 'New Arrivals'
    },
    {
      title: 'Fresh picks for every home',
      subtitle: 'Upgrade your space with curated essentials and smart lifestyle products.',
      badge: 'Trending Now'
    },
    {
      title: 'Everyday value, delivered fast',
      subtitle: 'Explore handpicked favorites with premium quality and amazing savings.',
      badge: 'Limited Offer'
    }
  ];

  readonly categories: Category[] = [
    { name: 'Electronics', icon: 'devices', description: 'Smartphones, laptops and accessories' },
    { name: 'Fashion', icon: 'checkroom', description: 'Trendy essentials for every style' },
    { name: 'Home', icon: 'home', description: 'Modern comfort for every room' },
    { name: 'Sports', icon: 'sports_basketball', description: 'Performance gear for active lifestyles' }
  ];

  readonly featuredProducts: ProductCard[] = [
    { id: 1, name: 'Noise Smart Watch', description: 'Smart fitness tracking with a vivid display and long battery life.', category: 'Electronics', price: 89, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80', tag: 'Best Seller' },
    { id: 2, name: 'Aurora Headphones', description: 'Immersive sound with premium comfort for daily listening.', category: 'Electronics', price: 129, stock: 20, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', tag: 'Top Rated' },
    { id: 3, name: 'Luma Lamp', description: 'Minimal lighting for modern interiors and cozy evenings.', category: 'Home', price: 59, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80', tag: 'New' }
  ];

  readonly bestSellers: ProductCard[] = [
    { id: 4, name: 'Eco Tote Bag', description: 'A durable everyday bag designed for casual errands and travel.', category: 'Fashion', price: 34, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80', tag: 'Hot Deal' },
    { id: 5, name: 'Glow Blender', description: 'High-speed blending with a sleek finish for daily smoothies.', category: 'Home', price: 72, stock: 8, imageUrl: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=900&q=80', tag: 'Premium' },
    { id: 6, name: 'Zen Chair', description: 'Comfortable ergonomic seating crafted for modern spaces.', category: 'Home', price: 149, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80', tag: 'Trending' }
  ];

  currentIndex = 0;

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  addToCart(product: ProductCard): void {
    this.cartService.addToCart({
      id: product.id ?? 0,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
  }

  toggleWishlist(product: ProductCard): void {
    this.wishlistService.toggleWishlist({
      id: product.id ?? 0,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl
    });
  }

  isWishlisted(product: ProductCard): boolean {
    return this.wishlistService.isInWishlist(product.id ?? 0);
  }

  openCategory(categoryName: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryName } });
  }
}

