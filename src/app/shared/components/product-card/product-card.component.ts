import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="product-card">
      <div class="product-image">
        <img [src]="product.imageUrl" [alt]="product.name" />
        @if (product.stock <= 5 && product.stock > 0) {
          <div class="stock-badge low-stock">Low Stock</div>
        }
        @if (product.stock === 0) {
          <div class="stock-badge out-of-stock">Out of Stock</div>
        }
        @if (product.featured) {
          <div class="featured-badge">Featured</div>
        }
      </div>

      <div class="product-info">
        <div class="product-category">{{ product.category }}</div>
        <h3 class="product-name">
          <a [routerLink]="['/products', product.id]">{{ product.name }}</a>
        </h3>
        <p class="product-description">{{ product.description | slice:0:100 }}...</p>
        
        <div class="product-footer">
          <div class="price">\${{ product.price | number:'1.2-2' }}</div>
          <div class="product-actions">
            @if (product.stock > 0) {
              @if (isInCart()) {
                <div class="quantity-controls">
                  <button (click)="decreaseQuantity()" class="btn-quantity">-</button>
                  <span class="quantity">{{ getQuantity() }}</span>
                  <button (click)="increaseQuantity()" class="btn-quantity">+</button>
                </div>
              } @else {
                <button (click)="addToCart()" class="btn btn-primary">
                  <i class="fas fa-cart-plus"></i>
                  Add to Cart
                </button>
              }
            } @else {
              <button class="btn btn-secondary" disabled>Out of Stock</button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .product-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image img {
      transform: scale(1.05);
    }

    .stock-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .low-stock {
      background: #ffc107;
      color: #856404;
    }

    .out-of-stock {
      background: #dc3545;
      color: white;
    }

    .featured-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .product-info {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .product-category {
      color: #667eea;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .product-name {
      margin-bottom: 12px;
      font-size: 18px;
      font-weight: 600;
    }

    .product-name a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .product-name a:hover {
      color: #667eea;
    }

    .product-description {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: 20px;
      flex: 1;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }

    .price {
      font-size: 20px;
      font-weight: 700;
      color: #667eea;
    }

    .product-actions {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f8f9fa;
      border-radius: 6px;
      padding: 4px;
    }

    .btn-quantity {
      width: 32px;
      height: 32px;
      border: none;
      background: #667eea;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      transition: background-color 0.3s ease;
    }

    .btn-quantity:hover {
      background: #5a6fd8;
    }

    .quantity {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      padding: 8px 16px;
    }

    @media (max-width: 768px) {
      .product-footer {
        flex-direction: column;
        gap: 12px;
      }

      .product-actions {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  
  private cartService = inject(CartService);

  addToCart(): void {
    this.cartService.addToCart(this.product, 1);
  }

  isInCart(): boolean {
    return this.cartService.isInCart(this.product.id);
  }

  getQuantity(): number {
    return this.cartService.getItemQuantity(this.product.id);
  }

  increaseQuantity(): void {
    const currentQuantity = this.getQuantity();
    this.cartService.updateQuantity(this.product.id, currentQuantity + 1);
  }

  decreaseQuantity(): void {
    const currentQuantity = this.getQuantity();
    if (currentQuantity > 1) {
      this.cartService.updateQuantity(this.product.id, currentQuantity - 1);
    } else {
      this.cartService.removeFromCart(this.product.id);
    }
  }
}