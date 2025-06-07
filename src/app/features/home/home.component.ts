import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, FormsModule],
  template: `
    <div class="home">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">Welcome to ShopHub</h1>
            <p class="hero-subtitle">Discover amazing products at unbeatable prices</p>
            <div class="hero-actions">
              <a routerLink="/products" class="btn btn-primary">Shop Now</a>
              <a href="#featured" class="btn btn-outline">View Featured</a>
            </div>
          </div>
          <div class="hero-image">
            <img src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Shopping" />
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <div class="features-grid">
            <div class="feature-card">
              <i class="fas fa-shipping-fast"></i>
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div class="feature-card">
              <i class="fas fa-undo"></i>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div class="feature-card">
              <i class="fas fa-shield-alt"></i>
              <h3>Secure Payment</h3>
              <p>Your payment information is safe</p>
            </div>
            <div class="feature-card">
              <i class="fas fa-headset"></i>
              <h3>24/7 Support</h3>
              <p>Customer support available anytime</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section id="featured" class="featured-products">
        <div class="container">
          <div class="section-header">
            <h2>Featured Products</h2>
            <p>Check out our most popular items</p>
          </div>

          @if (loading()) {
            <div class="loading">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="products-grid">
              @for (product of featuredProducts(); track product.id) {
                <app-product-card [product]="product"></app-product-card>
              }
            </div>
          }

          <div class="section-footer">
            <a routerLink="/products" class="btn btn-primary">View All Products</a>
          </div>
        </div>
      </section>

      <!-- Newsletter Section -->
      <section class="newsletter">
        <div class="container">
          <div class="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest deals and updates</p>
            <form class="newsletter-form" (ngSubmit)="onNewsletterSubmit()">
              <input 
                type="email" 
                placeholder="Enter your email" 
                class="form-control"
                [(ngModel)]="email"
                name="email"
                required>
              <button type="submit" class="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 120px 0 80px;
      margin-top: -80px;
    }

    .hero .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }

    .hero-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    .hero-subtitle {
      font-size: 20px;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 20px;
    }

    .hero-image img {
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .features {
      padding: 80px 0;
      background: white;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }

    .feature-card {
      text-align: center;
      padding: 40px 20px;
      border-radius: 12px;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-8px);
    }

    .feature-card i {
      font-size: 48px;
      color: #667eea;
      margin-bottom: 20px;
    }

    .feature-card h3 {
      font-size: 20px;
      margin-bottom: 16px;
      color: #333;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .featured-products {
      padding: 80px 0;
      background: #f8f9fa;
    }

    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .section-header h2 {
      font-size: 36px;
      margin-bottom: 16px;
      color: #333;
    }

    .section-header p {
      font-size: 18px;
      color: #666;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }

    .section-footer {
      text-align: center;
    }

    .newsletter {
      background: #2c3e50;
      color: white;
      padding: 80px 0;
    }

    .newsletter-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .newsletter-content h2 {
      font-size: 32px;
      margin-bottom: 16px;
    }

    .newsletter-content p {
      font-size: 18px;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .newsletter-form {
      display: flex;
      gap: 16px;
      max-width: 400px;
      margin: 0 auto;
    }

    .newsletter-form .form-control {
      flex: 1;
    }

    @media (max-width: 768px) {
      .hero .container {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero-title {
        font-size: 36px;
      }

      .hero-actions {
        justify-content: center;
        flex-wrap: wrap;
      }

      .features-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }

      .newsletter-form {
        flex-direction: column;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  
  featuredProducts = signal<Product[]>([]);
  loading = signal<boolean>(true);
  email = '';

  ngOnInit(): void {
    this.loadFeaturedProducts();
  }

  private loadFeaturedProducts(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: (products) => {
        this.featuredProducts.set(products);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading.set(false);
      }
    });
  }

  onNewsletterSubmit(): void {
    if (this.email) {
      // Mock newsletter subscription
      alert('Thank you for subscribing to our newsletter!');
      this.email = '';
    }
  }
}