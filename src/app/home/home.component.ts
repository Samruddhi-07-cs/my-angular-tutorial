import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { WishlistService } from '../services/wishlist.service';

interface Category {
  name: string;
  icon: string;
  description: string;
}

interface ProductCard {
  title: string;
  price: string;
  tag: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private cartService: CartService, private wishlistService: WishlistService) {}
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
    { title: 'Noise Smart Watch', price: '$89', tag: 'Best Seller', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80' },
    { title: 'Aurora Headphones', price: '$129', tag: 'Top Rated', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80' },
    { title: 'Luma Lamp', price: '$59', tag: 'New', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=900&q=80' }
  ];

  readonly bestSellers: ProductCard[] = [
    { title: 'Eco Tote Bag', price: '$34', tag: 'Hot Deal', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80' },
    { title: 'Glow Blender', price: '$72', tag: 'Premium', image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=900&q=80' },
    { title: 'Zen Chair', price: '$149', tag: 'Trending', image: 'https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80' }
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
      id: product.title.length,
      name: product.title,
      price: Number(product.price.replace(/[^\d.]/g, '')),
      image: product.image,
      category: 'Featured'
    });
  }

  toggleWishlist(product: ProductCard): void {
    this.wishlistService.toggleWishlist({
      id: product.title.length,
      name: product.title,
      price: Number(product.price.replace(/[^\d.]/g, '')),
      image: product.image,
      category: 'Featured'
    });
  }

  isWishlisted(product: ProductCard): boolean {
    return this.wishlistService.isInWishlist(product.title.length);
  }
}

