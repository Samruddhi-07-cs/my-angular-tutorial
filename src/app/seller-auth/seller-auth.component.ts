import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerService } from '../services/seller.service';

interface SellerAuthPayload {
  name?: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  readonly isLoginMode = signal(true);
  readonly isSubmitting = signal(false);
  readonly showPassword = signal(false);
  readonly message = signal<string | null>(null);
  readonly isError = signal(false);

  authForm: SellerAuthPayload = {
    email: '',
    password: ''
  };

  constructor(private seller: SellerService, private router: Router) {}

  toggleMode(): void {
    this.isLoginMode.update((value) => !value);
    this.message.set(null);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  submit(form: NgForm): void {
    if (!form.valid) {
      this.message.set('Please complete all required fields.');
      this.isError.set(true);
      return;
    }

    this.isSubmitting.set(true);
    this.message.set(null);

    const payload: SellerAuthPayload = {
      ...this.authForm,
      name: this.isLoginMode() ? undefined : this.authForm.name
    };

    this.seller.userSignup(payload as unknown as Record<string, unknown>).subscribe({
      next: (result) => {
        const response = result as { success?: boolean; message?: string } | null;
        this.message.set(response?.message ?? (this.isLoginMode() ? 'Welcome back! You are logged in.' : 'Account created successfully.'));
        this.isError.set(response?.success === false);
        this.isSubmitting.set(false);
        if (response?.success !== false) {
          this.router.navigate(['/seller-dashboard']);
        }
      },
      error: () => {
        this.message.set('Unable to complete the request right now.');
        this.isError.set(true);
        this.isSubmitting.set(false);
      }
    });
  }
}