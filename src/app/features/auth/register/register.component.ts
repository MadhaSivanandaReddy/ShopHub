import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="container">
        <div class="auth-card">
          <div class="auth-header">
            <h1>Create Account</h1>
            <p>Join our community today</p>
          </div>

          <form (ngSubmit)="onSubmit()" #registerForm="ngForm" class="auth-form">
            @if (error()) {
              <div class="alert alert-error">
                <i class="fas fa-exclamation-circle"></i>
                {{ error() }}
              </div>
            }

            <div class="form-row">
              <div class="form-group">
                <label for="firstName" class="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  [(ngModel)]="userData.firstName"
                  class="form-control"
                  placeholder="Enter your first name"
                  required
                  #firstNameInput="ngModel">
                @if (firstNameInput.invalid && firstNameInput.touched) {
                  <div class="form-error">First name is required</div>
                }
              </div>

              <div class="form-group">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="userData.lastName"
                  class="form-control"
                  placeholder="Enter your last name"
                  required
                  #lastNameInput="ngModel">
                @if (lastNameInput.invalid && lastNameInput.touched) {
                  <div class="form-error">Last name is required</div>
                }
              </div>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="userData.email"
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
                  [(ngModel)]="userData.password"
                  class="form-control"
                  placeholder="Create a password"
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
              <div class="password-strength">
                <div class="strength-bar" [class]="getPasswordStrength()"></div>
                <span class="strength-text">{{ getPasswordStrengthText() }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                class="form-control"
                placeholder="Confirm your password"
                required
                #confirmPasswordInput="ngModel">
              @if (confirmPasswordInput.touched && userData.password !== confirmPassword) {
                <div class="form-error">Passwords do not match</div>
              }
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="agreeToTerms"
                  name="agreeToTerms"
                  required>
                <span class="checkmark"></span>
                I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
              </label>
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="btn btn-primary btn-block"
                [disabled]="registerForm.invalid || userData.password !== confirmPassword || !agreeToTerms || loading()">
                @if (loading()) {
                  <i class="fas fa-spinner fa-spin"></i>
                  Creating Account...
                } @else {
                  <i class="fas fa-user-plus"></i>
                  Create Account
                }
              </button>
            </div>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
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
      max-width: 500px;
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

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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

    .password-strength {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .strength-bar {
      height: 4px;
      width: 100px;
      border-radius: 2px;
      background: #e9ecef;
      transition: all 0.3s ease;
    }

    .strength-bar.weak {
      background: #dc3545;
      width: 30%;
    }

    .strength-bar.medium {
      background: #ffc107;
      width: 60%;
    }

    .strength-bar.strong {
      background: #28a745;
      width: 100%;
    }

    .strength-text {
      font-size: 12px;
      color: #666;
    }

    .checkbox-label {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      font-size: 14px;
      line-height: 1.5;
    }

    .checkbox-label input[type="checkbox"] {
      margin: 0;
      width: 18px;
      height: 18px;
      accent-color: #667eea;
    }

    .checkbox-label a {
      color: #667eea;
      text-decoration: none;
    }

    .checkbox-label a:hover {
      text-decoration: underline;
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

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  confirmPassword = '';
  agreeToTerms = false;
  loading = signal<boolean>(false);
  error = signal<string>('');
  showPassword = false;

  onSubmit(): void {
    if (this.isFormValid()) {
      this.loading.set(true);
      this.error.set('');

      this.authService.register(this.userData).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.loading.set(false);
          this.error.set(error.message || 'Registration failed. Please try again.');
        }
      });
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrength(): string {
    const password = this.userData.password;
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'Weak';
      case 'medium': return 'Medium';
      case 'strong': return 'Strong';
      default: return '';
    }
  }

  private isFormValid(): boolean {
    const isValid = (
      this.userData.firstName &&
      this.userData.lastName &&
      this.userData.email &&
      this.userData.password &&
      this.userData.password === this.confirmPassword &&
      this.agreeToTerms
    );
    return typeof isValid === 'boolean' ? isValid : false;
  }
}