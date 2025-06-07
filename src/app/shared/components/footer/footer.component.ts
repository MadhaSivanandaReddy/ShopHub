import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>ShopHub</h3>
            <p>Your trusted e-commerce platform for quality products and exceptional service.</p>
            <div class="social-links">
              <a href="#"><i class="fab fa-facebook"></i></a>
              <a href="#"><i class="fab fa-twitter"></i></a>
              <a href="#"><i class="fab fa-instagram"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>

          <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a routerLink="/">Home</a></li>
              <li><a routerLink="/products">Products</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Customer Service</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Shipping Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Size Guide</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4>Contact Info</h4>
            <div class="contact-info">
              <p><i class="fas fa-envelope"></i> support&#64;shophub.com</p>
              <p><i class="fas fa-phone"></i> +1 (555) 123-4567</p>
              <p><i class="fas fa-map-marker-alt"></i> 123 Commerce St, City, State 12345</p>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: #2c3e50;
      color: white;
      padding: 60px 0 20px;
      margin-top: 80px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      margin-bottom: 40px;
    }

    .footer-section h3 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 24px;
    }

    .footer-section h4 {
      margin-bottom: 20px;
      font-size: 18px;
      color: #ecf0f1;
    }

    .footer-section p {
      line-height: 1.6;
      color: #bdc3c7;
      margin-bottom: 20px;
    }

    .footer-section ul {
      list-style: none;
    }

    .footer-section ul li {
      margin-bottom: 10px;
    }

    .footer-section ul li a {
      color: #bdc3c7;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section ul li a:hover {
      color: #667eea;
    }

    .social-links {
      display: flex;
      gap: 15px;
    }

    .social-links a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: #34495e;
      color: white;
      border-radius: 50%;
      text-decoration: none;
      transition: all 0.3s ease;
    }

    .social-links a:hover {
      background: #667eea;
      transform: translateY(-2px);
    }

    .contact-info p {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }

    .contact-info i {
      color: #667eea;
      width: 20px;
    }

    .footer-bottom {
      border-top: 1px solid #34495e;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }

    .footer-links {
      display: flex;
      gap: 20px;
    }

    .footer-links a {
      color: #bdc3c7;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #667eea;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 40px 0 20px;
      }

      .footer-content {
        gap: 30px;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }

      .footer-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {}