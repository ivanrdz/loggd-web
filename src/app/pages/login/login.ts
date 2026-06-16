import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <img src="logo.svg" alt="Loggd" class="login-logo">
        <h1>Loggd</h1>
        <p>Track your habits, goals and tasks</p>

        <div #googleBtn></div>

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
    .login-logo { width: 64px; height: 64px; border-radius: 16px; }
  `]
})
export class LoginComponent implements OnInit {
  @ViewChild('googleBtn', { static: true }) googleBtn!: ElementRef;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.initGoogleLogin(this.googleBtn.nativeElement);
  }

  devLogin() {
    this.auth.devLogin();
  }
}
