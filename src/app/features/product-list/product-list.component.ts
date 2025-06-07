import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="product-list">
      <div class="container">
        <div class="page-header">
          <h1>Products</h1>
          <p>Discover our amazing collection of products</p>
        </div>

        <!-- Filters and Search -->
        <div class="filters-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search products..." 
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              class="form-control">
          </div>

          <div class="filters">
            <select [(ngModel)]="selectedCategory" (change)="onCategoryChange()" class="form-control">
              <option value="">All Categories</option>
              @for (category of categories(); track category) {
                <option [value]="category">{{ category }}</option>
              }
            </select>

            <select [(ngModel)]="sortBy" (change)="onSortChange()" class="form-control">
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        @if (loading()) {
          <div class="loading">
            <div class="spinner"></div>
          </div>
        } @else if (filteredProducts().length === 0) {
          <div class="no-products">
            <i class="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        } @else {
          <div class="products-grid">
            @for (product of filteredProducts(); track product.id) {
              <app-product-card [product]="product"></app-product-card>
            }
          </div>
        }

        <!-- Load More Button -->
        @if (hasMoreProducts()) {
          <div class="load-more">
            <button (click)="loadMore()" class="btn btn-outline">Load More Products</button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .product-list {
      padding: 40px 0;
      min-height: calc(100vh - 160px);
    }

    .page-header {
      text-align: center;
      margin-bottom: 60px;
    }

    .page-header h1 {
      font-size: 36px;
      margin-bottom: 16px;
      color: #333;
    }

    .page-header p {
      font-size: 18px;
      color: #666;
    }

    .filters-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 40px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 30px;
      align-items: center;
    }

    .search-box {
      position: relative;
      max-width: 400px;
    }

    .search-box i {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }

    .search-box .form-control {
      padding-left: 48px;
    }

    .filters {
      display: flex;
      gap: 16px;
    }

    .filters .form-control {
      min-width: 150px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
      margin-bottom: 60px;
    }

    .no-products {
      text-align: center;
      padding: 80px 20px;
      color: #666;
    }

    .no-products i {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .no-products h3 {
      font-size: 24px;
      margin-bottom: 12px;
    }

    .load-more {
      text-align: center;
    }

    @media (max-width: 768px) {
      .filters-section {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .filters {
        flex-direction: column;
      }

      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal<boolean>(true);
  
  searchQuery = '';
  selectedCategory = '';
  sortBy = 'name';
  displayedCount = 12;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.applyFilters();
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      }
    });
  }

  private loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      }
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryChange(): void {
    this.applyFilters();
  }

  onSortChange(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.products()];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply sorting
    switch (this.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    // Apply pagination
    const displayed = filtered.slice(0, this.displayedCount);
    this.filteredProducts.set(displayed);
  }

  hasMoreProducts(): boolean {
    return this.filteredProducts().length < this.products().length;
  }

  loadMore(): void {
    this.displayedCount += 12;
    this.applyFilters();
  }
}