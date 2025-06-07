import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  // Signal for reactive UI updates
  public isAuthenticated = signal<boolean>(false);
  public currentUser = signal<User | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    // Mock login for demo purposes
    return this.mockLogin(credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      }),
      catchError(error => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    // Mock registration for demo purposes
    return this.mockRegister(userData).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
        this.currentUser.set(response.user);
        this.isAuthenticated.set(true);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  // Mock methods for demo purposes
  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        if (credentials.email === 'admin@demo.com' && credentials.password === 'admin123') {
          observer.next({
            user: {
              id: '1',
              email: 'admin@demo.com',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              createdAt: new Date()
            },
            token: 'mock-admin-token'
          });
        } else if (credentials.email === 'user@demo.com' && credentials.password === 'user123') {
          observer.next({
            user: {
              id: '2',
              email: 'user@demo.com',
              firstName: 'John',
              lastName: 'Doe',
              role: 'customer',
              createdAt: new Date()
            },
            token: 'mock-user-token'
          });
        } else {
          observer.error({ message: 'Invalid credentials' });
        }
        observer.complete();
      }, 1000);
    });
  }

  private mockRegister(userData: RegisterRequest): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          user: {
            id: Math.random().toString(36).substr(2, 9),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'customer',
            createdAt: new Date()
          },
          token: 'mock-token-' + Math.random().toString(36).substr(2, 9)
        });
        observer.complete();
      }, 1000);
    });
  }
}