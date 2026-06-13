import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>🪵 Loggd</h1>
        <p>Track your habits, goals and tasks</p>
        <button (click)="login()">
          Entrar (Dev Mode)
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
    }
    .login-card {
      text-align: center;
      padding: 2rem;
      background: #1a1a2e;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    h1 { font-size: 2.5rem; }
    p { color: #aaa; }
    button {
      padding: 12px 24px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
    }
    button:hover { background: #4f46e5; }
  `]
})
export class LoginComponent {
  constructor(private auth: AuthService) {}

  login() {
    this.auth.devLogin();
  }
}
