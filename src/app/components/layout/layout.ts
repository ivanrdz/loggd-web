import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app">

      <!-- Mobile topbar -->
      <header class="mobile-header">
        <span class="mobile-logo">🪵 Loggd</span>
        <button class="hamburger" (click)="menuOpen.set(!menuOpen())">
          <span [class]="menuOpen() ? 'icon-x' : 'icon-menu'"></span>
        </button>
      </header>

      <!-- Overlay -->
      @if (menuOpen()) {
        <div class="overlay" (click)="menuOpen.set(false)"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar" [class.open]="menuOpen()">
        <div class="sidebar-logo">🪵 Loggd</div>

        <nav>
          @for (item of navItems; track item.path) {
            <a class="nav-item"
              [routerLink]="item.path"
              routerLinkActive="active"
              (click)="menuOpen.set(false)">
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label">{{ item.label }}</span>
            </a>
          }
          @if (isAdmin()) {
            <a class="nav-item admin"
              routerLink="/admin"
              routerLinkActive="active"
              (click)="menuOpen.set(false)">
              <span class="nav-icon">🛡</span>
              <span class="nav-label">Admin</span>
            </a>
          }
        </nav>

        <div class="sidebar-bottom">
          @if (user()) {
            <div class="user-card">
              @if (user()?.avatarUrl) {
                <img [src]="user()?.avatarUrl" class="user-avatar" alt="avatar">
              } @else {
                <div class="user-initials">{{ user()?.name?.charAt(0) }}</div>
              }
              <div class="user-meta">
                <div class="user-name">{{ user()?.name }}</div>
                <div class="user-level">Nivel {{ user()?.level }}</div>
              </div>
            </div>
          }
          <button class="btn-logout" (click)="logout()">
            Cerrar sesión
          </button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="main">
        <router-outlet />
      </main>

    </div>
  `,
  styles: [`
    .app {
      display: flex;
      min-height: 100vh;
      background: var(--bg);
    }

    /* ── Mobile header ── */
    .mobile-header {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 52px;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 0.5px solid var(--border);
      align-items: center;
      justify-content: space-between;
      padding: 0 1.25rem;
      z-index: 100;
    }
    .mobile-logo {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .hamburger {
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-menu, .icon-x {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      position: relative;
      transition: all 0.2s;
    }
    .icon-menu::before, .icon-menu::after {
      content: '';
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      position: absolute;
    }
    .icon-menu::before { top: -7px; }
    .icon-menu::after { top: 7px; }
    .icon-x {
      background: transparent;
    }
    .icon-x::before {
      content: '';
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      position: absolute;
      transform: rotate(45deg);
      top: 0;
    }
    .icon-x::after {
      content: '';
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      position: absolute;
      transform: rotate(-45deg);
      top: 0;
    }

    /* ── Overlay ── */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      z-index: 98;
      backdrop-filter: blur(4px);
    }

    /* ── Sidebar ── */
    .sidebar {
      width: 240px;
      min-height: 100vh;
      background: var(--bg-secondary);
      border-right: 0.5px solid var(--border);
      display: flex;
      flex-direction: column;
      padding: 2rem 1rem;
      gap: 2rem;
      position: sticky;
      top: 0;
      height: 100vh;
      flex-shrink: 0;
    }
    .sidebar-logo {
      font-size: 1.2rem;
      font-weight: 600;
      padding: 0 0.75rem;
      color: var(--text-primary);
    }

    /* ── Nav ── */
    nav {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 400;
      transition: all 0.15s;
      cursor: pointer;
    }
    .nav-item:hover {
      background: var(--surface-hover);
      color: var(--text-primary);
    }
    .nav-item.active {
      background: var(--surface);
      color: var(--text-primary);
      font-weight: 500;
    }
    .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
    .nav-item.admin { color: var(--accent); }
    .nav-item.admin:hover { color: var(--accent-hover); }

    /* ── Sidebar bottom ── */
    .sidebar-bottom {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: var(--surface);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .user-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    .user-initials {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 600;
      flex-shrink: 0;
    }
    .user-meta { overflow: hidden; }
    .user-name {
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-level {
      font-size: 0.72rem;
      color: var(--text-secondary);
    }
    .btn-logout {
      background: none;
      border: 0.5px solid var(--border);
      color: var(--text-secondary);
      padding: 9px 14px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      font-size: 0.85rem;
      width: 100%;
      transition: all 0.15s;
    }
    .btn-logout:hover {
      border-color: var(--danger);
      color: var(--danger);
    }

    /* ── Main ── */
    .main {
      flex: 1;
      overflow-y: auto;
      min-width: 0;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .mobile-header { display: flex; }
      .sidebar {
        position: fixed;
        left: -240px;
        top: 0;
        height: 100vh;
        z-index: 99;
        transition: left 0.3s ease;
        padding-top: 4rem;
      }
      .sidebar.open { left: 0; }
      .sidebar-logo { display: none; }
      .main { padding-top: 52px; }
    }
  `]
})
export class LayoutComponent {
  menuOpen = signal(false);
  user: any;

  navItems = [
    { path: '/habits', icon: '⚡', label: 'Habits' },
    { path: '/goals', icon: '🎯', label: 'Goals' },
    { path: '/tasks', icon: '✅', label: 'Tasks' },
    { path: '/profile', icon: '👤', label: 'Mi Perfil' },
  ];

  isAdmin = () => this.auth.currentUser()?.email === 'ivan.rodriguez.jaramillo@gmail.com';

  constructor(private auth: AuthService) {
    this.user = this.auth.currentUser;
  }

  logout() { this.auth.logout(); }
}
