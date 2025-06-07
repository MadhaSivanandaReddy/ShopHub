import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, CreateProductRequest, UpdateProductRequest } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();
  
  // Signal for reactive UI updates
  public products = signal<Product[]>([]);
  public loading = signal<boolean>(false);

  // Mock data for demo
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
      price: 299.99,
      imageUrl: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Electronics',
      stock: 25,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Smart Fitness Watch',
      description: 'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration.',
      price: 199.99,
      imageUrl: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Electronics',
      stock: 15,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Organic Cotton T-Shirt',
      description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
      price: 29.99,
      imageUrl: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Clothing',
      stock: 50,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Professional Camera Lens',
      description: 'High-performance camera lens for professional photography with superior optics.',
      price: 899.99,
      imageUrl: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Electronics',
      stock: 8,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Ergonomic Office Chair',
      description: 'Comfortable ergonomic office chair with lumbar support and adjustable height.',
      price: 449.99,
      imageUrl: 'https://images.pexels.com/photos/586996/pexels-photo-586996.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Furniture',
      stock: 12,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Stainless Steel Water Bottle',
      description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours.',
      price: 24.99,
      imageUrl: 'https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg?auto=compress&cs=tinysrgb&w=500',
      category: 'Accessories',
      stock: 35,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading.set(true);
    // Simulate API call with delay
    setTimeout(() => {
      this.productsSubject.next(this.mockProducts);
      this.products.set(this.mockProducts);
      this.loading.set(false);
    }, 500);
  }

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(300));
  }

  getProduct(id: string): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(200));
  }

  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.mockProducts.filter(p => p.featured);
    return of(featured).pipe(delay(200));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.mockProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
    return of(filtered).pipe(delay(200));
  }

  searchProducts(query: string): Observable<Product[]> {
    const filtered = this.mockProducts.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
    return of(filtered).pipe(delay(300));
  }

  createProduct(product: CreateProductRequest): Observable<Product> {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      ...product,
      featured: product.featured || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockProducts.push(newProduct);
    this.productsSubject.next([...this.mockProducts]);
    this.products.set([...this.mockProducts]);
    
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(product: UpdateProductRequest): Observable<Product> {
    const index = this.mockProducts.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.mockProducts[index] = {
        ...this.mockProducts[index],
        ...product,
        updatedAt: new Date()
      };
      this.productsSubject.next([...this.mockProducts]);
      this.products.set([...this.mockProducts]);
      return of(this.mockProducts[index]).pipe(delay(500));
    }
    throw new Error('Product not found');
  }

  deleteProduct(id: string): Observable<void> {
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
      this.productsSubject.next([...this.mockProducts]);
      this.products.set([...this.mockProducts]);
    }
    return of(void 0).pipe(delay(300));
  }

  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.mockProducts.map(p => p.category))];
    return of(categories).pipe(delay(100));
  }
}