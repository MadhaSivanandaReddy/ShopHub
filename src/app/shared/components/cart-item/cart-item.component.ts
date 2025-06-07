import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartItem } from '../../../core/models/cart.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-item">
      <div class="item-image">
        <img [src]="item.product.imageUrl" [alt]="item.product.name" />
      </div>

      <div class="item-details">
        <h4 class="item-name">
          <a [routerLink]="['/products', item.productId]">{{ item.product.name }}</a>
        </h4>
        <div class="item-price">\${{ item.product.price | number:'1.2-2' }}</div>
      </div>

      <div class="item-quantity">
        <button 
          (click)="onQuantityChange(item.quantity - 1)" 
          class="btn-quantity"
          [disabled]="item.quantity <= 1">
          -
        </button>
        <span class="quantity">{{ item.quantity }}</span>
        <button 
          (click)="onQuantityChange(item.quantity + 1)" 
          class="btn-quantity"
          [disabled]="item.quantity >= item.product.stock">
          +
        </button>
      </div>

      <div class="item-total">
        \${{ (item.product.price * item.quantity) | number:'1.2-2' }}
      </div>

      <button (click)="onRemove()" class="btn-remove" title="Remove item">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `,
  styles: [`
    .cart-item {
      display: grid;
      grid-template-columns: 80px 1fr auto auto auto;
      gap: 20px;
      align-items: center;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      margin-bottom: 16px;
    }

    .item-image img {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 6px;
    }

    .item-details {
      min-width: 0;
    }

    .item-name {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 600;
    }

    .item-name a {
      color: #333;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .item-name a:hover {
      color: #667eea;
    }

    .item-price {
      color: #666;
      font-size: 14px;
    }

    .item-quantity {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      padding: 8px;
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
      transition: all 0.3s ease;
    }

    .btn-quantity:hover:not(:disabled) {
      background: #5a6fd8;
    }

    .btn-quantity:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .quantity {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
    }

    .item-total {
      font-size: 18px;
      font-weight: 700;
      color: #667eea;
      min-width: 80px;
      text-align: right;
    }

    .btn-remove {
      width: 40px;
      height: 40px;
      border: none;
      background: #dc3545;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-remove:hover {
      background: #c82333;
      transform: scale(1.05);
    }

    @media (max-width: 768px) {
      .cart-item {
        grid-template-columns: 60px 1fr;
        gap: 12px;
        padding: 16px;
      }

      .item-image img {
        width: 60px;
        height: 60px;
      }

      .item-quantity,
      .item-total,
      .btn-remove {
        grid-column: 1 / -1;
        justify-self: center;
      }

      .item-quantity {
        margin-top: 12px;
      }

      .item-total {
        font-size: 16px;
        margin-top: 8px;
      }
    }
  `]
})
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<void>();

  onQuantityChange(newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= this.item.product.stock) {
      this.quantityChange.emit(newQuantity);
    }
  }

  onRemove(): void {
    this.remove.emit();
  }
}