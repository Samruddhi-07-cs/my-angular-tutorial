import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productData = signal<ProductItem[]>([]);
  isLoading = signal(false);

  constructor(private seller: SellerService) {}

  ngOnInit(): void {
    this.list();
  }

  list(): void {
    this.isLoading.set(true);
    this.seller.productList().subscribe({
      next: (result) => {
        this.productData.set((result as ProductItem[]) ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.productData.set([]);
        this.isLoading.set(false);
      }
    });
  }
}