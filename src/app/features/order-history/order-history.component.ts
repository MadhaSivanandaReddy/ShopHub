import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-history">
      <div class="container">
        <div class="page-header">
          <h1>Order History</h1>
          <p>Track your orders and view purchase history</p>
        </div>

        @if (route.snapshot.queryParams['success'] === 'true') {
          <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <div>
              <strong>Order placed successfully!</strong>
              <p>Your order has been received and is being processed.</p>
            </div>
          </div>
        }

        @if (loading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (orders().length === 0) {
          <div class="no-orders">
            <i class="fas fa-shopping-bag"></i>
            <h2>No orders yet</h2>
            <p>When you place orders, they will appear here</p>
            <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
          </div>
        } @else {
          <div class="orders-list">
            @for (order of orders(); track order.id) {
              <div class="order-card">
                <div class="order-header">
                  <div class="order-info">
                    <h3>Order #{{ order.id.toUpperCase() }}</h3>
                    <div class="order-meta">
                      <span class="order-date">
                        <i class="fas fa-calendar"></i>
                        {{ order.createdAt | date:'medium' }}
                      </span>
                      <span class="order-status" [class]="'status-' + order.status">
                        <i [class]="getStatusIcon(order.status)"></i>
                        {{ order.status | titlecase }}
                      </span>
                    </div>
                  </div>
                  <div class="order-total">
                    <span class="total-label">Total</span>
                    <span class="total-amount">\${{ order.total | number:'1.2-2' }}</span>
                  </div>
                </div>

                <div class="order-items">
                  @for (item of order.items; track item.productId) {
                    <div class="order-item">
                      <img [src]="item.imageUrl" [alt]="item.productName">
                      <div class="item-details">
                        <div class="item-name">{{ item.productName }}</div>
                        <div class="item-quantity">Quantity: {{ item.quantity }}</div>
                        <div class="item-price">\${{ item.price | number:'1.2-2' }} each</div>
                      </div>
                      <div class="item-total">
                        \${{ (item.price * item.quantity) | number:'1.2-2' }}
                      </div>
                    </div>
                  }
                </div>

                <div class="order-footer">
                  <div class="shipping-info">
                    <h4><i class="fas fa-shipping-fast"></i> Shipping Address</h4>
                    <div class="address">
                      {{ order.shippingAddress.street }}<br>
                      {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zipCode }}<br>
                      {{ order.shippingAddress.country }}
                    </div>
                  </div>
                  
                  <div class="payment-info">
                    <h4><i class="fas fa-credit-card"></i> Payment Method</h4>
                    <div class="payment-method">{{ order.paymentMethod | titlecase }}</div>
                  </div>

                  <div class="order-actions">
                    @if (order.status === 'pending') {
                      <button class="btn btn-outline">Cancel Order</button>
                    }
                    @if (order.status === 'delivered') {
                      <button class="btn btn-outline">Reorder</button>
                      <button class="btn btn-outline">Leave Review</button>
                    }
                    <button class="btn btn-primary">Track Order</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .order-history {
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

    .no-orders {
      text-align: center;
      padding: 80px 20px;
    }

    .no-orders i {
      font-size: 80px;
      color: #ccc;
      margin-bottom: 30px;
    }

    .no-orders h2 {
      font-size: 28px;
      margin-bottom: 16px;
      color: #333;
    }

    .no-orders p {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .order-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 24px 30px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
    }

    .order-info h3 {
      font-size: 20px;
      margin-bottom: 8px;
      color: #333;
    }

    .order-meta {
      display: flex;
      gap: 20px;
      font-size: 14px;
    }

    .order-date {
      color: #666;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .order-status {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 12px;
    }

    .status-pending {
      background: #fff3cd;
      color: #856404;
    }

    .status-processing {
      background: #cce5ff;
      color: #004085;
    }

    .status-shipped {
      background: #d4edda;
      color: #155724;
    }

    .status-delivered {
      background: #d1ecf1;
      color: #0c5460;
    }

    .status-cancelled {
      background: #f8d7da;
      color: #721c24;
    }

    .order-total {
      text-align: right;
    }

    .total-label {
      display: block;
      color: #666;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .total-amount {
      font-size: 24px;
      font-weight: 700;
      color: #667eea;
    }

    .order-items {
      padding: 0 30px;
    }

    .order-item {
      display: grid;
      grid-template-columns: 80px 1fr auto;
      gap: 16px;
      align-items: center;
      padding: 20px 0;
      border-bottom: 1px solid #e9ecef;
    }

    .order-item:last-child {
      border-bottom: none;
    }

    .order-item img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-name {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .item-quantity,
    .item-price {
      color: #666;
      font-size: 14px;
    }

    .item-total {
      font-weight: 600;
      color: #667eea;
      font-size: 16px;
    }

    .order-footer {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 30px;
      padding: 24px 30px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
    }

    .order-footer h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      margin-bottom: 8px;
      color: #333;
    }

    .order-footer h4 i {
      color: #667eea;
    }

    .address,
    .payment-method {
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .order-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 150px;
    }

    .order-actions .btn {
      font-size: 14px;
      padding: 8px 16px;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .order-header {
        flex-direction: column;
        gap: 16px;
      }

      .order-meta {
        flex-direction: column;
        gap: 8px;
      }

      .order-item {
        grid-template-columns: 60px 1fr;
        gap: 12px;
      }

      .order-item img {
        width: 60px;
        height: 60px;
      }

      .item-total {
        grid-column: 1 / -1;
        text-align: center;
        margin-top: 8px;
      }

      .order-footer {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .order-actions {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
  `]
})
export class OrderHistoryComponent implements OnInit {
  route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  
  orders = signal<Order[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.orderService.getUserOrders(user.id).subscribe({
        next: (orders) => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.loading.set(false);
        }
      });
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'fas fa-clock';
      case 'processing': return 'fas fa-cog fa-spin';
      case 'shipped': return 'fas fa-truck';
      case 'delivered': return 'fas fa-check-circle';
      case 'cancelled': return 'fas fa-times-circle';
      default: return 'fas fa-question-circle';
    }
  }
}