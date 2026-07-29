import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { SellerService } from '../services/seller.service';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
}

interface ProductPayload {
  id?: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  readonly product = signal<ProductDetail | null>(null);
  readonly isLoading = signal(false);

  constructor(private route: ActivatedRoute, private seller: SellerService, private cartService: CartService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading.set(true);

    this.seller.productList().subscribe({
      next: (result) => {
        const items = (result ?? []) as ProductPayload[];
        const selected = items.find((item) => item.id === id);
        this.product.set(selected && selected.id !== undefined ? {
          id: selected.id,
          name: selected.name,
          price: selected.price,
          category: selected.category,
          color: selected.color,
          image: selected.image,
          description: selected.description
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
      id: current.id,
      name: current.name,
      price: current.price,
      image: current.image,
      category: current.category
    });
  }
}
