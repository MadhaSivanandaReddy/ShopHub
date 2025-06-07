import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
            @if (error()) {
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ error() }}
              </div>
            }

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="credentials.email"
                class="form-control"
                placeholder="Enter your email"
                required
                email
                #emailInput="ngModel">
              @if (emailInput.invalid && emailInput.touched) {
                <div class="form-error">Please enter a valid email address</div>
              }
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div class="password-input">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="credentials.password"
                  class="form-control"
                  placeholder="Enter your password"
                  required
                  minlength="6"
                  #passwordInput="ngModel">
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="password-toggle">
                  <i [class]="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              @if (passwordInput.invalid && passwordInput.touched) {
                <div class="form-error">Password must be at least 6 characters</div>
              }
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary btn-block"
                [disabled]="loginForm.invalid || loading()">
                @if (loading()) {
                  <i class="fas fa-spinner fa-spin"></i>
                  Signing In...
                } @else {
                  <i class="fas fa-sign-in-alt"></i>
                  Sign In
                }
              </button>
            </div>

            <div class="demo-credentials">
              <h4>Demo Credentials</h4>
              <div class="demo-accounts">
                <div class="demo-account">
                  <strong>Admin Account:</strong><br>
                  Email: admin&#64;demo.com<br>
                  Password: admin123
                  <button type="button" (click)="fillDemoCredentials('admin')" class="btn-demo">Use</button>
                </div>
                <div class="demo-account">
                  <strong>Customer Account:</strong><br>
                  Email: user&#64;demo.com<br>
                  Password: user123
                  <button type="button" (click)="fillDemoCredentials('user')" class="btn-demo">Use</button>
                </div>
              </div>
            </div>
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/register">Sign up here</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      padding: 40px 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-card {
      max-width: 450px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .auth-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .auth-header h1 {
      font-size: 28px;
      margin-bottom: 8px;
      font-weight: 700;
    }

    .auth-header p {
      opacity: 0.9;
      font-size: 16px;
    }

    .auth-form {
      padding: 40px 30px 30px;
    }

    .password-input {
      position: relative;
    }

    .password-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 4px;
    }

    .password-toggle:hover {
      color: #667eea;
    }

    .form-error {
      color: #dc3545;
      font-size: 14px;
      margin-top: 4px;
    }

    .btn-block {
      width: 100%;
      justify-content: center;
      gap: 8px;
    }

    .demo-credentials {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .demo-credentials h4 {
      margin-bottom: 16px;
      color: #333;
      font-size: 16px;
      text-align: center;
    }

    .demo-accounts {
      display: grid;
      gap: 16px;
    }

    .demo-account {
      padding: 16px;
      background: white;
      border-radius: 6px;
      border: 1px solid #dee2e6;
      font-size: 14px;
      line-height: 1.4;
      position: relative;
    }

    .btn-demo {
      position: absolute;
      top: 8px;
      right: 8px;
      background: #667eea;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .btn-demo:hover {
      background: #5a6fd8;
    }

    .auth-footer {
      padding: 20px 30px 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 768px) {
      .auth-card {
        margin: 0 16px;
      }

      .auth-header,
      .auth-form,
      .auth-footer {
        padding-left: 20px;
        padding-right: 20px;
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  loading = signal<boolean>(false);
  error = signal<string>('');
  showPassword = false;

  onSubmit(): void {
    if (this.credentials.email && this.credentials.password) {
      this.loading.set(true);
      this.error.set('');

      this.authService.login(this.credentials).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.message || 'Login failed. Please try again.');
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  fillDemoCredentials(type: 'admin' | 'user'): void {
    if (type === 'admin') {
      this.credentials.email = 'admin@demo.com';
      this.credentials.password = 'admin123';
    } else {
      this.credentials.email = 'user@demo.com';
      this.credentials.password = 'user123';
    }
  }
}