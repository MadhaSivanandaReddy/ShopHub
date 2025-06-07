import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from '../../shared/components/cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CartItemComponent],
  template: `
    <div class="cart">
      <div class="container">
        <div class="page-header">
          <h1>Shopping Cart</h1>
          @if (cartService.itemCount() > 0) {
            <p>{{ cartService.itemCount() }} item(s) in your cart</p>
          }
        </div>

        @if (cartService.cartItems().length === 0) {
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <a routerLink="/products" class="btn btn-primary">Continue Shopping</a>
          </div>
        } @else {
          <div class="cart-content">
            <div class="cart-items">
              <div class="cart-header">
                <h2>Items in Cart</h2>
                <button (click)="clearCart()" class="btn btn-outline">
                  <i class="fas fa-trash"></i>
                  Clear Cart
                </button>
              </div>

              @for (item of cartService.cartItems(); track item.productId) {
                <app-cart-item 
                  [item]="item"
                  (quantityChange)="updateQuantity(item.productId, $event)"
                  (remove)="removeItem(item.productId)">
                </app-cart-item>
              }
            </div>

            <div class="cart-summary">
              <div class="summary-card">
                <h3>Order Summary</h3>
                
                <div class="summary-row">
                  <span>Subtotal ({{ cartService.itemCount() }} items)</span>
                  <span>\${{ cartService.total() | number:'1.2-2' }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Shipping</span>
                  <span>{{ cartService.total() >= 50 ? 'Free' : '$9.99' }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Tax</span>
                  <span>\${{ getTax() | number:'1.2-2' }}</span>
                </div>
                
                <hr>
                
                <div class="summary-row total">
                  <span>Total</span>
                  <span>\${{ getFinalTotal() | number:'1.2-2' }}</span>
                </div>

                @if (cartService.total() < 50) {
                  <div class="shipping-notice">
                    <i class="fas fa-info-circle"></i>
                    Add \${{ (50 - cartService.total()) | number:'1.2-2' }} more for free shipping
                  </div>
                }

                <div class="checkout-actions">
                  <a routerLink="/checkout" class="btn btn-primary btn-block">
                    <i class="fas fa-lock"></i>
                    Proceed to Checkout
                  </a>
                  <a routerLink="/products" class="btn btn-outline btn-block">
                    Continue Shopping
                  </a>
                </div>
              </div>

              <div class="security-badges">
                <div class="badge">
                  <i class="fas fa-shield-alt"></i>
                  <span>Secure Checkout</span>
                </div>
                <div class="badge">
                  <i class="fas fa-undo"></i>
                  <span>30-Day Returns</span>
                </div>
                <div class="badge">
                  <i class="fas fa-shipping-fast"></i>
                  <span>Fast Shipping</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart {
      padding: 40px 0;
      min-height: calc(100vh - 160px);
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-size: 36px;
      margin-bottom: 12px;
      color: #333;
    }

    .page-header p {
      color: #666;
      font-size: 16px;
    }

    .empty-cart {
      text-align: center;
      padding: 80px 20px;
    }

    .empty-cart i {
      font-size: 80px;
      color: #ccc;
      margin-bottom: 30px;
    }

    .empty-cart h2 {
      font-size: 28px;
      margin-bottom: 16px;
      color: #333;
    }

    .empty-cart p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 40px;
      align-items: start;
    }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e9ecef;
    }

    .cart-header h2 {
      font-size: 24px;
      color: #333;
    }

    .summary-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 100px;
    }

    .summary-card h3 {
      font-size: 20px;
      margin-bottom: 24px;
      color: #333;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 16px;
    }

    .summary-row.total {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin-top: 16px;
    }

    .shipping-notice {
      background: #e3f2fd;
      color: #1976d2;
      padding: 12px 16px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .checkout-actions {
      margin-top: 30px;
    }

    .btn-block {
      width: 100%;
      margin-bottom: 12px;
      justify-content: center;
    }

    .security-badges {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .badge i {
      color: #667eea;
      width: 16px;
    }

    hr {
      border: none;
      border-top: 1px solid #e9ecef;
      margin: 20px 0;
    }

    @media (max-width: 768px) {
      .cart-content {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .summary-card {
        position: static;
      }

      .cart-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class CartComponent {
  cartService = inject(CartService);

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  getTax(): number {
    return this.cartService.total() * 0.08; // 8% tax
  }

  getShipping(): number {
    return this.cartService.total() >= 50 ? 0 : 9.99;
  }

  getFinalTotal(): number {
    return this.cartService.total() + this.getTax() + this.getShipping();
  }
}