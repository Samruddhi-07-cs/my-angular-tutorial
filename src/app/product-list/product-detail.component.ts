import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../product';
import { CartService } from '../services/cart.service';
import { SellerService } from '../services/seller.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  readonly product = signal<Product | null>(null);
  readonly isLoading = signal(false);

  constructor(private route: ActivatedRoute, private seller: SellerService, private cartService: CartService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading.set(true);

    this.seller.productList().subscribe({
      next: (result) => {
        const items = (result ?? []) as Product[];
        const selected = items.find((item) => item.id === id);
        this.product.set(selected && selected.id !== undefined ? {
          ...selected
        } : null);
        this.isLoading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.isLoading.set(false);
      }
    });
  }

  addToCart(): void {
    const current = this.product();
    if (!current) {
      return;
    }

    this.cartService.addToCart({
      id: current.id ?? 0,
      name: current.name,
      description: current.description,
      category: current.category,
      price: current.price,
      stock: current.stock,
      imageUrl: current.imageUrl
    });
  }
}
