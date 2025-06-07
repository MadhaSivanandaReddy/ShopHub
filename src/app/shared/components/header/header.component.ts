import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a routerLink="/" class="logo-link">
              <i class="fas fa-shopping-bag"></i>
              <span>ShopHub</span>
            </a>
          </div>

          <nav class="nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/products" routerLinkActive="active">Products</a>
            @if (authService.isAuthenticated()) {
              <a routerLink="/orders" routerLinkActive="active">Orders</a>
              @if (authService.isAdmin()) {
                <a routerLink="/admin" routerLinkActive="active">Admin</a>
              }
            }
          </nav>

          <div class="header-actions">
            <a routerLink="/cart" class="cart-link">
              <i class="fas fa-shopping-cart"></i>
              @if (cartService.itemCount() > 0) {
                <span class="cart-badge">{{ cartService.itemCount() }}</span>
              }
            </a>

            @if (authService.isAuthenticated()) {
              <div class="user-menu">
                <span class="user-name">{{ authService.currentUser()?.firstName }}</span>
                <button (click)="logout()" class="btn btn-outline">Logout</button>
              </div>
            } @else {
              <div class="auth-links">
                <a routerLink="/login" class="btn btn-outline">Login</a>
                <a routerLink="/register" class="btn btn-primary">Register</a>
              </div>
            }
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: white;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 80px;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 80px;
    }

    .logo-link {
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #667eea;
      font-size: 24px;
      font-weight: 700;
    }

    .logo-link i {
      font-size: 28px;
    }

    .nav {
      display: flex;
      gap: 32px;
    }

    .nav a {
      text-decoration: none;
      color: #555;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .nav a:hover,
    .nav a.active {
      color: #667eea;
      background-color: rgba(102, 126, 234, 0.1);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .cart-link {
      position: relative;
      color: #555;
      font-size: 20px;
      text-decoration: none;
      padding: 8px;
      border-radius: 6px;
      transition: color 0.3s ease;
    }

    .cart-link:hover {
      color: #667eea;
    }

    .cart-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #dc3545;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-name {
      font-weight: 500;
      color: #555;
    }

    .auth-links {
      display: flex;
      gap: 12px;
    }

    @media (max-width: 768px) {
      .nav {
        display: none;
      }
      
      .header-actions {
        gap: 12px;
      }
      
      .auth-links {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}