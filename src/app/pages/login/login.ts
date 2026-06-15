import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { SocialLoginModule } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SocialLoginModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo">🪵</div>
        <h1>Loggd</h1>
        <p>Track your habits, goals and tasks</p>

        <button class="btn-google" (click)="loginWithGoogle()">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continuar con Google
        </button>

        <div class="divider">
          <span>o</span>
        </div>

        <button class="btn-dev" (click)="devLogin()">
          Entrar en modo dev
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: #0a0a14;
    }
    .login-card {
      text-align: center;
      padding: 2.5rem;
      background: #0f0f1a;
      border: 1px solid #1e1e32;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 360px;
    }
    .logo { font-size: 3rem; }
    h1 { font-size: 2rem; font-weight: 700; color: #e2e2e2; margin: 0; }
    p { color: #666; margin: 0; font-size: 0.95rem; }
    .btn-google {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      color: #333;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
      justify-content: center;
      transition: background 0.15s;
    }
    .btn-google:hover { background: #f5f5f5; }
    .divider {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      color: #444;
      font-size: 0.85rem;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #1e1e32;
    }
    .btn-dev {
      background: transparent;
      border: 1px solid #1e1e32;
      color: #555;
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      width: 100%;
    }
    .btn-dev:hover { border-color: #444; color: #aaa; }
  `]
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  devLogin() {
    this.auth.devLogin();
  }
}
