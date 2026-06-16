import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="logo">🪵 Loggd</div>
        <nav>
          <a class="nav-item" routerLink="/habits" routerLinkActive="active">
            <span>⚡</span> Habits
          </a>
          <a class="nav-item" routerLink="/goals" routerLinkActive="active">
            <span>🎯</span> Goals
          </a>
          <a class="nav-item" routerLink="/tasks" routerLinkActive="active">
            <span>✅</span> Tasks
          </a>
        </nav>

        @if (user()) {
          <div class="user-info">
            @if (user()?.avatarUrl) {
              <img [src]="user()?.avatarUrl" class="avatar" alt="avatar">
            } @else {
              <div class="avatar-placeholder">
                {{ user()?.name?.charAt(0) }}
              </div>
            }
            <div class="user-details">
              <div class="user-name">{{ user()?.name }}</div>
              <div class="user-level">Nivel {{ user()?.level }}</div>
            </div>
          </div>
        }

        <button class="btn-logout" (click)="logout()">← Salir</button>
      </aside>

      <main class="main">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .layout { display: flex; height: 100vh; background: #0a0a14; color: #e2e2e2; }
    .sidebar { width: 220px; background: #0f0f1a; border-right: 1px solid #1e1e32; display: flex; flex-direction: column; padding: 1.5rem 1rem; gap: 2rem; }
    .logo { font-size: 1.3rem; font-weight: 700; padding: 0 0.5rem; }
    nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: #666; cursor: pointer; font-size: 0.95rem; transition: all 0.15s; text-decoration: none; }
    .nav-item:hover { background: #1a1a2e; color: #e2e2e2; }
    .nav-item.active { background: #1a1a2e; color: #e2e2e2; }
    .main { flex: 1; overflow-y: auto; }
    .user-info { display: flex; align-items: center; gap: 10px; padding: 12px; background: #1a1a2e; border-radius: 10px; margin-top: auto; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
    .avatar-placeholder { width: 36px; height: 36px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem; flex-shrink: 0; }
    .user-name { font-size: 0.85rem; font-weight: 500; color: #e2e2e2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 130px; }
    .user-level { font-size: 0.75rem; color: #555; }
    .btn-logout { background: transparent; border: 1px solid #1e1e32; color: #666; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
    .btn-logout:hover { color: #e2e2e2; border-color: #444; }
    .user-info { display: flex; align-items: center; gap: 10px; padding: 12px; background: #1a1a2e; border-radius: 10px; margin-top: auto; overflow: hidden; }
  `]
})
export class LayoutComponent {
  user: any;

  constructor(private auth: AuthService) {
    this.user = this.auth.currentUser;
  }

  logout() { this.auth.logout(); }
}
