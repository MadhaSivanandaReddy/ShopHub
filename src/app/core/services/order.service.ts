import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order, CreateOrderRequest, OrderItem } from '../models/order.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  public orders$ = this.ordersSubject.asObservable();
  
  public orders = signal<Order[]>([]);
  public loading = signal<boolean>(false);

  // Mock orders for demo
  private mockOrders: Order[] = [];

  constructor(
    private http: HttpClient,
    private cartService: CartService
  ) {}

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    this.loading.set(true);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user-id',
      items: orderData.items.map(item => ({
        productId: item.productId,
        productName: 'Product Name',
        price: 0,
        quantity: item.quantity,
        imageUrl: ''
      })),
      total: 0,
      status: 'pending',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.mockOrders.push(newOrder);
    this.ordersSubject.next([...this.mockOrders]);
    this.orders.set([...this.mockOrders]);
    this.loading.set(false);

    return of(newOrder).pipe(delay(1000));
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const userOrders = this.mockOrders.filter(order => order.userId === userId);
    return of(userOrders).pipe(delay(300));
  }

  getOrder(orderId: string): Observable<Order | undefined> {
    const order = this.mockOrders.find(o => o.id === orderId);
    return of(order).pipe(delay(200));
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<Order> {
    const orderIndex = this.mockOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      this.mockOrders[orderIndex].status = status;
      this.mockOrders[orderIndex].updatedAt = new Date();
      this.ordersSubject.next([...this.mockOrders]);
      this.orders.set([...this.mockOrders]);
      return of(this.mockOrders[orderIndex]).pipe(delay(300));
    }
    throw new Error('Order not found');
  }

  getAllOrders(): Observable<Order[]> {
    return of(this.mockOrders).pipe(delay(300));
  }
}