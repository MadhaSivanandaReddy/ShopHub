import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-dashboard">
      <div class="container">
        <div class="page-header">
          <h1>Admin Dashboard</h1>
          <p>Manage your e-commerce platform</p>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-box"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalProducts() }}</div>
              <div class="stat-label">Total Products</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ totalOrders() }}</div>
              <div class="stat-label">Total Orders</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-dollar-sign"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">\${{ totalRevenue() | number:'1.2-2' }}</div>
              <div class="stat-label">Total Revenue</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-star"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ featuredProducts() }}</div>
              <div class="stat-label">Featured Products</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <a routerLink="/admin/products" class="action-card">
              <i class="fas fa-boxes"></i>
              <h3>Manage Products</h3>
              <p>Add, edit, or remove products from your catalog</p>
            </a>

            <div class="action-card">
              <i class="fas fa-chart-line"></i>
              <h3>View Analytics</h3>
              <p>Track sales performance and customer behavior</p>
            </div>

            <div class="action-card">
              <i class="fas fa-users"></i>
              <h3>Manage Users</h3>
              <p>View and manage customer accounts</p>
            </div>

            <div class="action-card">
              <i class="fas fa-cog"></i>
              <h3>Settings</h3>
              <p>Configure store settings and preferences</p>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="recent-orders">
          <div class="section-header">
            <h2>Recent Orders</h2>
            <a href="#" class="view-all">View All Orders</a>
          </div>

          @if (loading()) {
            <div class="loading">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="orders-table">
              <div class="table-header">
                <div>Order ID</div>
                <div>Customer</div>
                <div>Date</div>
                <div>Status</div>
                <div>Total</div>
                <div>Actions</div>
              </div>

              @for (order of recentOrders(); track order.id) {
                <div class="table-row">
                  <div class="order-id">#{{ order.id.toUpperCase() }}</div>
                  <div class="customer">Customer {{ order.userId }}</div>
                  <div class="date">{{ order.createdAt | date:'short' }}</div>
                  <div class="status">
                    <span class="status-badge" [class]="'status-' + order.status">
                      {{ order.status | titlecase }}
                    </span>
                  </div>
                  <div class="total">\${{ order.total | number:'1.2-2' }}</div>
                  <div class="actions">
                    <button class="btn-action" title="View Details">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action" title="Edit Order">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="no-orders">
                  <i class="fas fa-inbox"></i>
                  <p>No recent orders</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 60px;
    }

    .stat-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .stat-number {
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin-bottom: 4px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
      font-weight: 500;
    }

    .quick-actions {
      margin-bottom: 60px;
    }

    .quick-actions h2 {
      font-size: 24px;
      margin-bottom: 30px;
      color: #333;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }

    .action-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      text-decoration: none;
      color: inherit;
      transition: all 0.3s ease;
      text-align: center;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);
    }

    .action-card i {
      font-size: 48px;
      color: #667eea;
      margin-bottom: 20px;
    }

    .action-card h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: #333;
    }

    .action-card p {
      color: #666;
      line-height: 1.5;
    }

    .recent-orders {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30px;
      border-bottom: 1px solid #e9ecef;
    }

    .section-header h2 {
      font-size: 20px;
      color: #333;
    }

    .view-all {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .orders-table {
      display: grid;
    }

    .table-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
      gap: 20px;
      padding: 20px 30px;
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
      font-size: 14px;
      text-transform: uppercase;
    }

    .table-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr auto;
      gap: 20px;
      padding: 20px 30px;
      border-bottom: 1px solid #e9ecef;
      align-items: center;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .order-id {
      font-weight: 600;
      color: #667eea;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
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

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border: none;
      background: #f8f9fa;
      color: #666;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-action:hover {
      background: #667eea;
      color: white;
    }

    .no-orders {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-orders i {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .actions-grid {
        grid-template-columns: 1fr;
      }

      .table-header,
      .table-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .table-header {
        display: none;
      }

      .table-row {
        padding: 16px 20px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  
  totalProducts = signal<number>(0);
  totalOrders = signal<number>(0);
  totalRevenue = signal<number>(0);
  featuredProducts = signal<number>(0);
  recentOrders = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // Load products data
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.totalProducts.set(products.length);
        this.featuredProducts.set(products.filter(p => p.featured).length);
      }
    });

    // Load orders data
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.totalOrders.set(orders.length);
        this.totalRevenue.set(orders.reduce((sum, order) => sum + order.total, 0));
        this.recentOrders.set(orders.slice(0, 5));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}