import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  level: number;
  totalXP: number;
  createdAt: string;
  lastActiveAt?: string;
  habitsCount: number;
  goalsCount: number;
  tasksCount: number;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="topbar">
        <h2>🛡 Admin — Usuarios</h2>
        <div class="badge">{{ users().length }} usuarios</div>
      </div>

      @if (loading()) {
        <div class="loading">Cargando usuarios...</div>
      }

      @if (forbidden()) {
        <div class="forbidden">
          🚫 No tienes permisos para ver esta página.
        </div>
      }

      <div class="users-list">
        @for (user of users(); track user.id) {
          <div class="user-card">
            <div class="user-left">
              @if (user.avatarUrl) {
                <img [src]="user.avatarUrl" class="avatar" alt="avatar">
              } @else {
                <div class="avatar-placeholder">{{ user.name?.charAt(0) }}</div>
              }
              <div class="user-info">
                <div class="user-name">{{ user.name }}</div>
                <div class="user-email">{{ user.email }}</div>
                <div class="user-date">
                  Registrado: {{ user.createdAt | date:'mediumDate' }}
                  @if (user.lastActiveAt) {
                    · Activo: {{ user.lastActiveAt | date:'mediumDate' }}
                  }
                </div>
              </div>
            </div>
            <div class="user-stats">
              <div class="stat">
                <span class="stat-val">{{ user.habitsCount }}</span>
                <span class="stat-lbl">Hábitos</span>
              </div>
              <div class="stat">
                <span class="stat-val">{{ user.goalsCount }}</span>
                <span class="stat-lbl">Metas</span>
              </div>
              <div class="stat">
                <span class="stat-val">{{ user.tasksCount }}</span>
                <span class="stat-lbl">Tareas</span>
              </div>
              <div class="stat">
                <span class="stat-val">{{ user.level }}</span>
                <span class="stat-lbl">Nivel</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 2rem; }
    .topbar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .topbar h2 { font-size: 1.5rem; font-weight: 600; color: #e2e2e2; }
    .badge { background: #1a1a2e; border: 1px solid #6366f1; color: #6366f1; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
    .users-list { display: flex; flex-direction: column; gap: 1rem; }
    .avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; }
    .avatar-placeholder { width: 48px; height: 48px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 700; color: white; flex-shrink: 0; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-val { font-size: 1.1rem; font-weight: 700; color: #6366f1; }
    .stat-lbl { font-size: 0.72rem; color: #555; }
    .loading { color: #666; padding: 2rem; text-align: center; }
    .forbidden { background: #2d1a1a; border: 1px solid #ef4444; color: #ef4444; padding: 1.5rem; border-radius: 12px; text-align: center; font-weight: 600; }
    .user-card { background: #0f0f1a; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
    .user-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .user-info { min-width: 0; overflow: hidden; }
    .user-name { font-weight: 600; color: var(--text-primary); font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-email { font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .user-date { font-size: 0.75rem; color: var(--text-tertiary); margin-top: 4px; }
    .user-stats { display: flex; gap: 1rem; flex-wrap: wrap; }
  `]
})
export class AdminComponent implements OnInit {
  users = signal<AdminUser[]>([]);
  loading = signal(false);
  forbidden = signal(false);

  private apiUrl = 'https://loggd-backend-production.up.railway.app/api/Admin';

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.http.get<AdminUser[]>(`${this.apiUrl}/users`).subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: err => {
        this.loading.set(false);
        if (err.status === 403) this.forbidden.set(true);
      }
    });
  }
}
