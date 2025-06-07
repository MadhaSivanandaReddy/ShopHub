import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem, Cart } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  // Signals for reactive UI updates
  public cartItems = signal<CartItem[]>([]);
  public itemCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  public total = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  constructor() {
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        this.cartItemsSubject.next(items);
        this.cartItems.set(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems()));
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex > -1) {
      // Update existing item
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex].quantity += quantity;
      this.updateCart(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          stock: product.stock
        },
        quantity
      };
      this.updateCart([...currentItems, newItem]);
    }
  }

  removeFromCart(productId: string): void {
    const updatedItems = this.cartItems().filter(item => item.productId !== productId);
    this.updateCart(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const updatedItems = this.cartItems().map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.updateCart(updatedItems);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.cartItems.set(items);
    this.saveCartToStorage();
  }

  getCart(): Cart {
    return {
      items: this.cartItems(),
      total: this.total(),
      itemCount: this.itemCount()
    };
  }

  isInCart(productId: string): boolean {
    return this.cartItems().some(item => item.productId === productId);
  }

  getItemQuantity(productId: string): number {
    const item = this.cartItems().find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }
}