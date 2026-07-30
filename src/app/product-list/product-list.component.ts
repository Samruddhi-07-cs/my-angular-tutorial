import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { SellerService } from '../services/seller.service';

interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
  description: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productData = signal<ProductItem[]>([]);
  filteredProducts = signal<ProductItem[]>([]);
  isLoading = signal(false);
  searchTerm = signal('');

  constructor(private seller: SellerService, private cartService: CartService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const search = params.get('search') ?? '';
      const category = params.get('category') ?? '';
      this.searchTerm.set(search || category);
      this.list();
    });
  }

  list(): void {
    this.isLoading.set(true);
    this.seller.productList().subscribe({
      next: (result) => {
        const products = (result as ProductItem[]) ?? [];
        this.productData.set(products);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: () => {
        this.productData.set([]);
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) {
      this.filteredProducts.set(this.productData());
      return;
    }

    const matches = this.productData().filter((product) => {
      return product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
    });

    this.filteredProducts.set(matches);
  }

  addToCart(product: ProductItem): void {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category
    });
  }
}