import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SellerAuthComponent } from './seller-auth/seller-auth.component';
import { CartComponent } from './cart/cart.component';
import { AddProductComponent } from './add-product/add-product.component';
import { WishlistComponent } from './wishlist/wishlist.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductListComponent
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./product-list/product-detail.component').then((m) => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'seller-auth',
    component: SellerAuthComponent
  },
  {
    path: 'seller-dashboard',
    component: AddProductComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  }
];
