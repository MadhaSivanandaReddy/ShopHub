import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Address } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout">
      <div class="container">
        <div class="page-header">
          <h1>Checkout</h1>
          <p>Complete your order</p>
        </div>

        <div class="checkout-content">
          <div class="checkout-form">
            <form (ngSubmit)="onSubmit()" #checkoutForm="ngForm">
              <!-- Shipping Information -->
              <div class="form-section">
                <h2><i class="fas fa-shipping-fast"></i> Shipping Information</h2>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="street" class="form-label">Street Address</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      [(ngModel)]="shippingAddress.street"
                      class="form-control"
                      placeholder="123 Main Street"
                      required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="city" class="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      [(ngModel)]="shippingAddress.city"
                      class="form-control"
                      placeholder="New York"
                      required>
                  </div>
                  <div class="form-group">
                    <label for="state" class="form-label">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      [(ngModel)]="shippingAddress.state"
                      class="form-control"
                      placeholder="NY"
                      required>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="zipCode" class="form-label">ZIP Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      [(ngModel)]="shippingAddress.zipCode"
                      class="form-control"
                      placeholder="10001"
                      required>
                  </div>
                  <div class="form-group">
                    <label for="country" class="form-label">Country</label>
                    <select
                      id="country"
                      name="country"
                      [(ngModel)]="shippingAddress.country"
                      class="form-control"
                      required>
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Payment Information -->
              <div class="form-section">
                <h2><i class="fas fa-credit-card"></i> Payment Information</h2>
                
                <div class="payment-methods">
                  <label class="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit-card"
                      [(ngModel)]="paymentMethod"
                      required>
                    <span class="method-content">
                      <i class="fas fa-credit-card"></i>
                      Credit Card
                    </span>
                  </label>
                  
                  <label class="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      [(ngModel)]="paymentMethod"
                      required>
                    <span class="method-content">
                      <i class="fab fa-paypal"></i>
                      PayPal
                    </span>
                  </label>
                  
                  <label class="payment-method">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="apple-pay"
                      [(ngModel)]="paymentMethod"
                      required>
                    <span class="method-content">
                      <i class="fab fa-apple-pay"></i>
                      Apple Pay
                    </span>
                  </label>
                </div>

                @if (paymentMethod === 'credit-card') {
                  <div class="credit-card-form">
                    <div class="form-group">
                      <label for="cardNumber" class="form-label">Card Number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        [(ngModel)]="cardDetails.number"
                        class="form-control"
                        placeholder="1234 5678 9012 3456"
                        maxlength="19">
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group">
                        <label for="expiryDate" class="form-label">Expiry Date</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          [(ngModel)]="cardDetails.expiry"
                          class="form-control"
                          placeholder="MM/YY"
                          maxlength="5">
                      </div>
                      <div class="form-group">
                        <label for="cvv" class="form-label">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          [(ngModel)]="cardDetails.cvv"
                          class="form-control"
                          placeholder="123"
                          maxlength="4">
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="cardName" class="form-label">Name on Card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        [(ngModel)]="cardDetails.name"
                        class="form-control"
                        placeholder="John Doe">
                    </div>
                  </div>
                }
              </div>

              <div class="form-actions">
                <button
                  type="submit"
                  class="btn btn-primary btn-block"
                  [disabled]="checkoutForm.invalid || loading()">
                  @if (loading()) {
                    <i class="fas fa-spinner fa-spin"></i>
                    Processing Order...
                  } @else {
                    <i class="fas fa-lock"></i>
                    Place Order (\${{ getFinalTotal() | number:'1.2-2' }})
                  }
                </button>
              </div>
            </form>
          </div>

          <div class="order-summary">
            <div class="summary-card">
              <h3>Order Summary</h3>
              
              <div class="order-items">
                @for (item of cartService.cartItems(); track item.productId) {
                  <div class="order-item">
                    <img [src]="item.product.imageUrl" [alt]="item.product.name">
                    <div class="item-details">
                      <div class="item-name">{{ item.product.name }}</div>
                      <div class="item-quantity">Qty: {{ item.quantity }}</div>
                    </div>
                    <div class="item-price">\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</div>
                  </div>
                }
              </div>

              <div class="summary-totals">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>\${{ cartService.total() | number:'1.2-2' }}</span>
                </div>
                
                <div class="summary-row">
                  <span>Shipping</span>
                  <span>{{ getShipping() === 0 ? 'Free' : '$' + (getShipping() | number:'1.2-2') }}</span>
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
              </div>

              <div class="security-info">
                <div class="security-item">
                  <i class="fas fa-shield-alt"></i>
                  <span>SSL Encrypted</span>
                </div>
                <div class="security-item">
                  <i class="fas fa-lock"></i>
                  <span>Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout {
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

    .checkout-content {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 40px;
      align-items: start;
    }

    .form-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 30px;
    }

    .form-section h2 {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 20px;
      margin-bottom: 24px;
      color: #333;
      padding-bottom: 16px;
      border-bottom: 2px solid #e9ecef;
    }

    .form-section h2 i {
      color: #667eea;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .payment-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .payment-method {
      display: block;
      cursor: pointer;
    }

    .payment-method input[type="radio"] {
      display: none;
    }

    .method-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      transition: all 0.3s ease;
      background: white;
    }

    .payment-method input[type="radio"]:checked + .method-content {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .method-content i {
      font-size: 24px;
      color: #667eea;
    }

    .credit-card-form {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-top: 20px;
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

    .order-items {
      margin-bottom: 24px;
    }

    .order-item {
      display: grid;
      grid-template-columns: 60px 1fr auto;
      gap: 12px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .order-item img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .item-quantity {
      color: #666;
      font-size: 12px;
    }

    .item-price {
      font-weight: 600;
      color: #667eea;
    }

    .summary-totals {
      border-top: 1px solid #e9ecef;
      padding-top: 20px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 16px;
    }

    .summary-row.total {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin-top: 16px;
    }

    .security-info {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #e9ecef;
    }

    .security-item {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #666;
      font-size: 14px;
    }

    .security-item i {
      color: #28a745;
      width: 16px;
    }

    .btn-block {
      width: 100%;
      justify-content: center;
      gap: 8px;
      font-size: 16px;
      padding: 16px;
    }

    hr {
      border: none;
      border-top: 1px solid #e9ecef;
      margin: 16px 0;
    }

    @media (max-width: 768px) {
      .checkout-content {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .payment-methods {
        grid-template-columns: 1fr;
      }

      .summary-card {
        position: static;
      }
    }
  `]
})
export class CheckoutComponent {
  private router = inject(Router);
  cartService = inject(CartService);
  private orderService = inject(OrderService);

  shippingAddress: Address = {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  };

  paymentMethod = '';
  cardDetails = {
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  };

  loading = signal<boolean>(false);

  onSubmit(): void {
    if (this.isFormValid()) {
      this.loading.set(true);

      const orderData = {
        items: this.cartService.cartItems().map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        shippingAddress: this.shippingAddress,
        paymentMethod: this.paymentMethod
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (order) => {
          this.cartService.clearCart();
          this.loading.set(false);
          this.router.navigate(['/orders'], { 
            queryParams: { success: 'true', orderId: order.id } 
          });
        },
        error: (error) => {
          console.error('Order creation failed:', error);
          this.loading.set(false);
          alert('Order failed. Please try again.');
        }
      });
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

  private isFormValid(): boolean {
    const addressValid = !!this.shippingAddress.street && 
                         !!this.shippingAddress.city && 
                         !!this.shippingAddress.state && 
                         !!this.shippingAddress.zipCode && 
                         !!this.shippingAddress.country;
    
    const paymentValid = !!this.paymentMethod && 
                        (this.paymentMethod !== 'credit-card' || 
                         (!!this.cardDetails.number && !!this.cardDetails.expiry && 
                          !!this.cardDetails.cvv && !!this.cardDetails.name));

    // Ensure both are strictly boolean
    return Boolean(addressValid) && Boolean(paymentValid);
  }
}