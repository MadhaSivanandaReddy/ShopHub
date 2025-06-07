import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, CreateProductRequest } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="product-management">
      <div class="container">
        <div class="page-header">
          <h1>Product Management</h1>
          <button (click)="showAddForm = !showAddForm" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            Add New Product
          </button>
        </div>

        <!-- Add Product Form -->
        @if (showAddForm) {
          <div class="add-product-form">
            <div class="form-card">
              <h2>Add New Product</h2>
              <form (ngSubmit)="onSubmit()" #productForm="ngForm">
                <div class="form-row">
                  <div class="form-group">
                    <label for="name" class="form-label">Product Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      [(ngModel)]="newProduct.name"
                      class="form-control"
                      placeholder="Enter product name"
                      required>
                  </div>
                  <div class="form-group">
                    <label for="category" class="form-label">Category</label>
                    <select
                      id="category"
                      name="category"
                      [(ngModel)]="newProduct.category"
                      class="form-control"
                      required>
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label for="description" class="form-label">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    [(ngModel)]="newProduct.description"
                    class="form-control"
                    rows="3"
                    placeholder="Enter product description"
                    required></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label for="price" class="form-label">Price ($)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      [(ngModel)]="newProduct.price"
                      class="form-control"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required>
                  </div>
                  <div class="form-group">
                    <label for="stock" class="form-label">Stock Quantity</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      [(ngModel)]="newProduct.stock"
                      class="form-control"
                      placeholder="0"
                      min="0"
                      required>
                  </div>
                </div>

                <div class="form-group">
                  <label for="imageUrl" class="form-label">Image URL</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    [(ngModel)]="newProduct.imageUrl"
                    class="form-control"
                    placeholder="https://example.com/image.jpg"
                    required>
                </div>

                <div class="form-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [(ngModel)]="newProduct.featured"
                      name="featured">
                    <span class="checkmark"></span>
                    Featured Product
                  </label>
                </div>

                <div class="form-actions">
                  <button type="button" (click)="cancelAdd()" class="btn btn-secondary">Cancel</button>
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="productForm.invalid || loading()">
                    @if (loading()) {
                      <i class="fas fa-spinner fa-spin"></i>
                      Adding...
                    } @else {
                      <i class="fas fa-plus"></i>
                      Add Product
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        }

        <!-- Products List -->
        <div class="products-section">
          <div class="section-header">
            <h2>All Products ({{ products().length }})</h2>
            <div class="filters">
              <select [(ngModel)]="filterCategory" (change)="applyFilters()" class="form-control">
                <option value="">All Categories</option>
                @for (category of categories(); track category) {
                  <option [value]="category">{{ category }}</option>
                }
              </select>
            </div>
          </div>

          @if (loading()) {
            <div class="loading">
              <div class="spinner"></div>
            </div>
          } @else {
            <div class="products-table">
              <div class="table-header">
                <div>Image</div>
                <div>Name</div>
                <div>Category</div>
                <div>Price</div>
                <div>Stock</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              @for (product of filteredProducts(); track product.id) {
                <div class="table-row">
                  <div class="product-image">
                    <img [src]="product.imageUrl" [alt]="product.name">
                  </div>
                  <div class="product-name">
                    <div class="name">{{ product.name }}</div>
                    @if (product.featured) {
                      <span class="featured-badge">Featured</span>
                    }
                  </div>
                  <div class="category">{{ product.category }}</div>
                  <div class="price">\${{ product.price | number:'1.2-2' }}</div>
                  <div class="stock" [class.low-stock]="product.stock <= 5">
                    {{ product.stock }}
                  </div>
                  <div class="status">
                    <span class="status-badge" [class]="product.stock > 0 ? 'in-stock' : 'out-of-stock'">
                      {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
                    </span>
                  </div>
                  <div class="actions">
                    <button (click)="editProduct(product)" class="btn-action edit" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button (click)="deleteProduct(product.id)" class="btn-action delete" title="Delete">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="no-products">
                  <i class="fas fa-box-open"></i>
                  <p>No products found</p>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-management {
      padding: 40px 0;
      min-height: calc(100vh - 160px);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-size: 36px;
      color: #333;
    }

    .add-product-form {
      margin-bottom: 60px;
    }

    .form-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .form-card h2 {
      font-size: 24px;
      margin-bottom: 30px;
      color: #333;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-weight: 500;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #667eea;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .products-section {
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

    .filters .form-control {
      min-width: 150px;
    }

    .products-table {
      display: grid;
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 2fr 1fr 1fr 1fr 1fr auto;
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
      grid-template-columns: 80px 2fr 1fr 1fr 1fr 1fr auto;
      gap: 20px;
      padding: 20px 30px;
      border-bottom: 1px solid #e9ecef;
      align-items: center;
    }

    .table-row:last-child {
      border-bottom: none;
    }

    .product-image img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 6px;
    }

    .product-name .name {
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .featured-badge {
      background: #667eea;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .price {
      font-weight: 600;
      color: #667eea;
    }

    .stock {
      font-weight: 500;
    }

    .low-stock {
      color: #dc3545;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
    }

    .in-stock {
      background: #d4edda;
      color: #155724;
    }

    .out-of-stock {
      background: #f8d7da;
      color: #721c24;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-action.edit {
      background: #e3f2fd;
      color: #1976d2;
    }

    .btn-action.edit:hover {
      background: #1976d2;
      color: white;
    }

    .btn-action.delete {
      background: #ffebee;
      color: #d32f2f;
    }

    .btn-action.delete:hover {
      background: #d32f2f;
      color: white;
    }

    .no-products {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-products i {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 20px;
        align-items: stretch;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .table-header {
        display: none;
      }

      .table-row {
        grid-template-columns: 1fr;
        gap: 8px;
        padding: 16px 20px;
      }
    }
  `]
})
export class ProductManagementComponent implements OnInit {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<string[]>([]);
  loading = signal<boolean>(false);
  
  showAddForm = false;
  filterCategory = '';
  
  newProduct: CreateProductRequest = {
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    stock: 0,
    featured: false
  };

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts(): void {
    this.loading.set(true);
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

  onSubmit(): void {
    if (this.isFormValid()) {
      this.loading.set(true);
      
      this.productService.createProduct(this.newProduct).subscribe({
        next: (product) => {
          this.products.update(products => [...products, product]);
          this.applyFilters();
          this.resetForm();
          this.loading.set(false);
          alert('Product added successfully!');
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.loading.set(false);
          alert('Failed to add product. Please try again.');
        }
      });
    }
  }

  editProduct(product: Product): void {
    // For demo purposes, just show an alert
    alert(`Edit product: ${product.name}`);
  }

  deleteProduct(productId: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.products.update(products => products.filter(p => p.id !== productId));
          this.applyFilters();
          alert('Product deleted successfully!');
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product. Please try again.');
        }
      });
    }
  }

  applyFilters(): void {
    let filtered = [...this.products()];
    
    if (this.filterCategory) {
      filtered = filtered.filter(product => product.category === this.filterCategory);
    }
    
    this.filteredProducts.set(filtered);
  }

  cancelAdd(): void {
    this.showAddForm = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
      stock: 0,
      featured: false
    };
    this.showAddForm = false;
  }

  private isFormValid(): boolean {
    return !!(
      this.newProduct.name &&
      this.newProduct.description &&
      this.newProduct.price > 0 &&
      this.newProduct.imageUrl &&
      this.newProduct.category &&
      this.newProduct.stock >= 0
    );
  }
}