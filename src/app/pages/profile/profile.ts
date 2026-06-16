import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="topbar">
        <h2>Mi Perfil</h2>
      </div>

      @if (user()) {
        <div class="profile-card">
          <div class="avatar-section">
            @if (user()?.avatarUrl) {
              <img [src]="user()?.avatarUrl" class="avatar-lg" alt="avatar">
            } @else {
              <div class="avatar-placeholder-lg">
                {{ user()?.name?.charAt(0) }}
              </div>
            }
            <div class="profile-info">
              <h3 class="profile-name">{{ user()?.name }}</h3>
              <p class="profile-email">{{ user()?.email }}</p>
              <div class="level-badge">Nivel {{ user()?.level }}</div>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ user()?.totalXP }}</div>
              <div class="stat-label">XP Total</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ user()?.level }}</div>
              <div class="stat-label">Nivel actual</div>
            </div>
          </div>

          <div class="info-section">
            <h4>Información de cuenta</h4>
            <div class="info-row">
              <span class="info-label">Email</span>
              <span class="info-value">{{ user()?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">ID</span>
              <span class="info-value id">{{ user()?.id }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Login</span>
              <span class="info-value">Google OAuth</span>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .container { padding: 2rem; max-width: 600px; }
    .topbar { margin-bottom: 1.5rem; }
    .topbar h2 { font-size: 1.5rem; font-weight: 600; color: #e2e2e2; }
    .profile-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 16px; padding: 2rem; display: flex; flex-direction: column; gap: 2rem; }
    .avatar-section { display: flex; align-items: center; gap: 1.5rem; }
    .avatar-lg { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #6366f1; }
    .avatar-placeholder-lg { width: 80px; height: 80px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700; color: white; flex-shrink: 0; }
    .profile-name { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin: 0 0 4px; word-break: break-word; }
    .profile-email { font-size: 0.82rem; color: var(--text-secondary); margin: 0 0 8px; word-break: break-all; }
    .level-badge { display: inline-block; background: #1a1a2e; border: 1px solid #6366f1; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .stat-card { background: #0a0a14; border: 1px solid #1e1e32; border-radius: 12px; padding: 1.25rem; text-align: center; }
    .stat-number { font-size: 2rem; font-weight: 700; color: #6366f1; }
    .stat-label { font-size: 0.8rem; color: #666; margin-top: 4px; }
    .info-section h4 { font-size: 0.85rem; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 1rem; }
    .info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #1e1e32; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: 0.85rem; color: #666; }
    .info-value { font-size: 0.82rem; color: var(--text-primary); word-break: break-all; text-align: right; max-width: 60%; }
    .info-value.id { font-family: monospace; font-size: 0.75rem; color: #555; }
  `]
})
export class ProfileComponent {
  user: any;

  constructor(private auth: AuthService) {
    this.user = this.auth.currentUser;
  }
}
