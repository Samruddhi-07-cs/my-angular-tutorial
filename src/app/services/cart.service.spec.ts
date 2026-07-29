import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('adds a product and updates the cart count', () => {
    service.addToCart({
      id: 7,
      name: 'Test Lamp',
      price: 42,
      image: 'lamp.jpg',
      category: 'Home'
    });

    expect(service.items().length).toBe(1);
    expect(service.cartCount()).toBe(1);
  });
});
