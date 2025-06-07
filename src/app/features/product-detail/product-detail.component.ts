import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-detail">
      <div class="container">
        @if (loading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (product()) {
          <div class="product-content">
            <div class="product-images">
              <div class="main-image">
                <img [src]="product()!.imageUrl" [alt]="product()!.name" />
                @if (product()!.featured) {
                  <div class="featured-badge">Featured</div>
                }
              </div>
            </div>

            <div class="product-info">
              <div class="breadcrumb">
                <a (click)="goBack()" class="back-link">
                  <i class="fas fa-arrow-left"></i> Back to Products
                </a>
              </div>

              <div class="product-category">{{ product()!.category }}</div>
              <h1 class="product-title">{{ product()!.name }}</h1>
              
              <div class="product-price">
                <span class="price">\${{ product()!.price | number:'1.2-2' }}</span>
              </div>

              <div class="product-description">
                <h3>Description</h3>
                <p>{{ product()!.description }}</p>
              </div>

              <div class="product-details">
                <div class="detail-item">
                  <span class="label">Stock:</span>
                  <span class="value" [class.low-stock]="product()!.stock <= 5">
                    {{ product()!.stock }} available
                  </span>
                </div>
                <div class="detail-item">
                  <span class="label">Category:</span>
                  <span class="value">{{ product()!.category }}</span>
                </div>
              </div>

              <div class="product-actions">
                @if (product()!.stock > 0) {
                  @if (isInCart()) {
                    <div class="quantity-section">
                      <label>Quantity in cart:</label>
                      <div class="quantity-controls">
                        <button (click)="decreaseQuantity()" class="btn-quantity">-</button>
                        <span class="quantity">{{ getQuantity() }}</span>
                        <button (click)="increaseQuantity()" class="btn-quantity" [disabled]="getQuantity() >= product()!.stock">+</button>
                      </div>
                    </div>
                    <button (click)="removeFromCart()" class="btn btn-danger">
                      <i class="fas fa-trash"></i>
                      Remove from Cart
                    </button>
                  } @else {
                    <div class="quantity-section">
                      <label for="quantity">Quantity:</label>
                      <div class="quantity-controls">
                        <button (click)="decreaseSelectedQuantity()" class="btn-quantity" [disabled]="selectedQuantity <= 1">-</button>
                        <span class="quantity">{{ selectedQuantity }}</span>
                        <button (click)="increaseSelectedQuantity()" class="btn-quantity" [disabled]="selectedQuantity >= product()!.stock">+</button>
                      </div>
                    </div>
                    <button (click)="addToCart()" class="btn btn-primary">
                      <i class="fas fa-cart-plus"></i>
                      Add to Cart
                    </button>
                  }
                } @else {
                  <div class="out-of-stock">
                    <i class="fas fa-exclamation-triangle"></i>
                    Out of Stock
                  </div>
                }
              </div>

              <div class="product-features">
                <div class="feature">
                  <i class="fas fa-shipping-fast"></i>
                  <span>Free shipping on orders over $50</span>
                </div>
                <div class="feature">
                  <i class="fas fa-undo"></i>
                  <span>30-day return policy</span>
                </div>
                <div class="feature">
                  <i class="fas fa-shield-alt"></i>
                  <span>Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <div class="not-found">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Product Not Found</h2>
            <p>The product you're looking for doesn't exist.</p>
            <button (click)="goBack()" class="btn btn-primary">Back to Products</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-detail {
      padding: 40px 0;
      min-height: calc(100vh - 160px);
    }

    .product-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: start;
    }

    .product-images {
      position: sticky;
      top: 100px;
    }

    .main-image {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .main-image img {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }

    .featured-badge {
      position: absolute;
      top: 20px;
      left: 20px;
      background: #667eea;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .product-info {
      padding: 20px 0;
    }

    .breadcrumb {
      margin-bottom: 20px;
    }

    .back-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.3s ease;
    }

    .back-link:hover {
      color: #5a6fd8;
    }

    .product-category {
      color: #667eea;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .product-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #333;
      line-height: 1.3;
    }

    .product-price {
      margin-bottom: 30px;
    }

    .price {
      font-size: 28px;
      font-weight: 700;
      color: #667eea;
    }

    .product-description {
      margin-bottom: 30px;
    }

    .product-description h3 {
      font-size: 18px;
      margin-bottom: 12px;
      color: #333;
    }

    .product-description p {
      color: #666;
      line-height: 1.6;
    }

    .product-details {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .detail-item:last-child {
      margin-bottom: 0;
    }

    .label {
      font-weight: 600;
      color: #333;
    }

    .value {
      color: #666;
    }

    .low-stock {
      color: #dc3545;
      font-weight: 600;
    }

    .product-actions {
      margin-bottom: 40px;
    }

    .quantity-section {
      margin-bottom: 20px;
    }

    .quantity-section label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 8px;
      width: fit-content;
    }

    .btn-quantity {
      width: 40px;
      height: 40px;
      border: none;
      background: #667eea;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 18px;
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
      min-width: 40px;
      text-align: center;
      font-weight: 600;
      font-size: 18px;
    }

    .out-of-stock {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f8d7da;
      color: #721c24;
      border-radius: 8px;
      font-weight: 600;
    }

    .product-features {
      border-top: 1px solid #e9ecef;
      padding-top: 30px;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #666;
    }

    .feature i {
      color: #667eea;
      width: 20px;
    }

    .not-found {
      text-align: center;
      padding: 80px 20px;
    }

    .not-found i {
      font-size: 64px;
      color: #dc3545;
      margin-bottom: 20px;
    }

    .not-found h2 {
      font-size: 28px;
      margin-bottom: 16px;
      color: #333;
    }

    .not-found p {
      color: #666;
      margin-bottom: 30px;
    }

    @media (max-width: 768px) {
      .product-content {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .product-images {
        position: static;
      }

      .main-image img {
        height: 300px;
      }

      .product-title {
        font-size: 24px;
      }

      .price {
        font-size: 24px;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  product = signal<Product | null>(null);
  loading = signal<boolean>(true);
  selectedQuantity = 1;

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
    }
  }

  private loadProduct(id: string): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product.set(product || null);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading.set(false);
      }
    });
  }

  addToCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.addToCart(currentProduct, this.selectedQuantity);
      this.selectedQuantity = 1;
    }
  }

  removeFromCart(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      this.cartService.removeFromCart(currentProduct.id);
    }
  }

  isInCart(): boolean {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.isInCart(currentProduct.id) : false;
  }

  getQuantity(): number {
    const currentProduct = this.product();
    return currentProduct ? this.cartService.getItemQuantity(currentProduct.id) : 0;
  }

  increaseQuantity(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      const currentQuantity = this.getQuantity();
      if (currentQuantity < currentProduct.stock) {
        this.cartService.updateQuantity(currentProduct.id, currentQuantity + 1);
      }
    }
  }

  decreaseQuantity(): void {
    const currentProduct = this.product();
    if (currentProduct) {
      const currentQuantity = this.getQuantity();
      if (currentQuantity > 1) {
        this.cartService.updateQuantity(currentProduct.id, currentQuantity - 1);
      } else {
        this.cartService.removeFromCart(currentProduct.id);
      }
    }
  }

  increaseSelectedQuantity(): void {
    const currentProduct = this.product();
    if (currentProduct && this.selectedQuantity < currentProduct.stock) {
      this.selectedQuantity++;
    }
  }

  decreaseSelectedQuantity(): void {
    if (this.selectedQuantity > 1) {
      this.selectedQuantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
}