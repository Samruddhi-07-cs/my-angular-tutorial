import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { SellerService } from '../services/seller.service';

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
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  readonly products = signal<ProductPayload[]>([]);
  readonly isLoading = signal(false);
  readonly isSubmitting = signal(false);
  readonly message = signal<string | null>(null);
  readonly isError = signal(false);
  readonly editingId = signal<number | null>(null);

  draft: ProductPayload = {
    name: '',
    price: 0,
    category: '',
    color: '',
    image: '',
    description: ''
  };

  constructor(private seller: SellerService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.seller.productList().subscribe({
      next: (result) => {
        this.products.set(result ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.message.set('Unable to load products right now.');
        this.isError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  submit(form: NgForm): void {
    if (!form.valid) {
      this.message.set('Please fill all required product fields.');
      this.isError.set(true);
      return;
    }

    this.isSubmitting.set(true);
    const payload: ProductPayload = {
      ...this.draft,
      price: Number(this.draft.price)
    };

    const request = this.editingId() !== null
      ? this.seller.updateProduct(this.editingId()!, payload)
      : this.seller.addProduct(payload);

    request.subscribe({
      next: () => {
        this.message.set(this.editingId() !== null ? 'Product updated successfully.' : 'Product added successfully.');
        this.isError.set(false);
        this.resetForm();
        this.loadProducts();
        this.isSubmitting.set(false);
      },
      error: () => {
        this.message.set('Something went wrong while saving the product.');
        this.isError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }

  editProduct(product: ProductPayload): void {
    this.draft = { ...product };
    this.editingId.set(product.id ?? null);
    this.message.set('Editing product. Update the details and save.');
    this.isError.set(false);
  }

  deleteProduct(id: number): void {
    this.seller.deleteProduct(id).subscribe({
      next: () => {
        this.message.set('Product deleted successfully.');
        this.isError.set(false);
        this.loadProducts();
      },
      error: () => {
        this.message.set('Unable to delete the product.');
        this.isError.set(true);
      }
    });
  }

  resetForm(): void {
    this.draft = {
      name: '',
      price: 0,
      category: '',
      color: '',
      image: '',
      description: ''
    };
    this.editingId.set(null);
  }
}
