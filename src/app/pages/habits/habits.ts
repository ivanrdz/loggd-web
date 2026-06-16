import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Habit, HabitsService } from '../../services/habits';
import { AuthService } from '../../services/auth';
import { ContributionGraph } from "../../components/contribution-graph/contribution-graph";
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, FormsModule, ContributionGraph, RouterLink, RouterLinkActive],
  template: `
    <div class="layout">

  <!-- Sidebar -->
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

      <!-- Main -->
      <main class="main">
        <div class="topbar">
          <h2>Habits</h2>
          <button class="btn-primary" (click)="showForm = !showForm">
            + New habit
          </button>
        </div>

        <!-- Form -->
        @if (showForm) {
          <div class="form-card">
            <input
              class="input"
              placeholder="Habit name"
              [(ngModel)]="newName" />
            <input
              class="input"
              placeholder="Description (optional)"
              [(ngModel)]="newDesc" />
            <div class="color-row">
              <span class="label">Color</span>
              @for (c of colors; track c) {
                <div class="color-dot"
                  [style.background]="c"
                  [class.selected]="selectedColor === c"
                  (click)="selectedColor = c">
                </div>
              }
            </div>
            <div class="emoji-row">
              <span class="label">Emoji</span>
              @for (e of emojis; track e) {
                <span class="emoji-opt"
                  [class.selected]="selectedEmoji === e"
                  (click)="selectedEmoji = e">{{ e }}</span>
              }
            </div>
            <div class="form-actions">
              <button class="btn-ghost" (click)="showForm = false">Cancelar</button>
              <button class="btn-primary" (click)="create()">Guardar</button>
            </div>
          </div>
        }

        <!-- Loading -->
        @if (loading()) {
          <div class="loading">Cargando hábitos...</div>
        }

        <!-- Habits list -->
        <div class="habits-list">
          @for (habit of habits(); track habit.id) {
            <div class="habit-card">
              <div class="habit-top">
                <div class="habit-left">
                  <span class="habit-emoji">{{ habit.emoji }}</span>
                  <div>
                    <div class="habit-name">{{ habit.name }}</div>
                    @if (habit.description) {
                      <div class="habit-desc">{{ habit.description }}</div>
                    }
                  </div>
                </div>
                <div class="habit-right">
                  <div class="stat">
                    <span class="stat-value">{{ habit.currentStreak }}</span>
                    <span class="stat-label">🔥 streak</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ habit.bestStreak }}</span>
                    <span class="stat-label">⭐ best</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ habit.totalCompletions }}</span>
                    <span class="stat-label">✅ total</span>
                  </div>
                  <button
                    class="btn-checkin"
                    [style.background]="habit.color"
                    (click)="checkIn(habit.id)">
                    Check in
                  </button>
                </div>
              </div>
              <div class="graph-wrapper">
                <app-contribution-graph
                  [contributions]="getContributions(habit)"
                  [color]="habit.color">
                </app-contribution-graph>
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .layout {
      display: flex;
      height: 100vh;
      background: #0a0a14;
      color: #e2e2e2;
    }

    /* Sidebar */
    .sidebar {
      width: 220px;
      background: #0f0f1a;
      border-right: 1px solid #1e1e32;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
      gap: 2rem;
    }
    .logo { font-size: 1.3rem; font-weight: 700; padding: 0 0.5rem; }
    nav { display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 8px;
      color: #666;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.15s;
    }
    .nav-item:hover { background: #1a1a2e; color: #e2e2e2; }
    .nav-item.active { background: #1a1a2e; color: #e2e2e2; }
    .btn-logout {
      margin-top: auto;
      background: transparent;
      border: 1px solid #1e1e32;
      color: #666;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .btn-logout:hover { color: #e2e2e2; border-color: #444; }

    /* Main */
    .main {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .topbar h2 { font-size: 1.5rem; font-weight: 600; }

    /* Buttons */
    .btn-primary {
      background: #6366f1;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: background 0.15s;
    }
    .btn-primary:hover { background: #4f46e5; }
    .btn-ghost {
      background: transparent;
      border: 1px solid #333;
      color: #aaa;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
    }

    /* Form */
    .form-card {
      background: #0f0f1a;
      border: 1px solid #1e1e32;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .input {
      background: #0a0a14;
      border: 1px solid #1e1e32;
      color: #e2e2e2;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 0.95rem;
      outline: none;
    }
    .input:focus { border-color: #6366f1; }
    .label { font-size: 0.85rem; color: #666; }
    .color-row, .emoji-row {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .color-dot {
      width: 22px; height: 22px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 0.1s;
    }
    .color-dot.selected { border-color: white; transform: scale(1.2); }
    .emoji-opt {
      font-size: 1.3rem;
      cursor: pointer;
      padding: 4px;
      border-radius: 6px;
      border: 2px solid transparent;
    }
    .emoji-opt.selected { border-color: #6366f1; background: #1a1a2e; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }

    /* Habit cards */
    .habits-list { display: flex; flex-direction: column; gap: 1rem; }
    .habit-card {
      background: #0f0f1a;
      border: 1px solid #1e1e32;
      border-radius: 14px;
      padding: 1.25rem 1.5rem;
      transition: border-color 0.15s;
    }
    .habit-card:hover { border-color: #2e2e4e; }
    .habit-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .habit-left { display: flex; align-items: center; gap: 12px; }
    .habit-emoji { font-size: 1.75rem; }
    .habit-name { font-weight: 600; font-size: 1rem; }
    .habit-desc { font-size: 0.82rem; color: #666; margin-top: 2px; }
    .habit-right { display: flex; align-items: center; gap: 1.5rem; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-value { font-size: 1.1rem; font-weight: 700; }
    .stat-label { font-size: 0.72rem; color: #666; }
    .btn-checkin {
      border: none;
      color: white;
      padding: 8px 18px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: opacity 0.15s;
    }
    .btn-checkin:hover { opacity: 0.85; }
    .graph-wrapper {
      overflow-x: auto;
      padding-top: 4px;
    }

    .loading { color: #666; padding: 2rem; text-align: center; }

    .user-info { display: flex; align-items: center; gap: 10px; padding: 12px; background: #1a1a2e; border-radius: 10px; margin-top: auto; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
    .avatar-placeholder { width: 36px; height: 36px; border-radius: 50%; background: #6366f1; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.9rem; flex-shrink: 0; }
    .user-name { font-size: 0.85rem; font-weight: 500; color: #e2e2e2; }
    .user-level { font-size: 0.75rem; color: #555; }
  `]
})
export class HabitsComponent implements OnInit {
  habits = signal<Habit[]>([]);
  loading = signal(false);
  showForm = false;
  newName = '';
  newDesc = '';
  selectedColor = '#6366f1';
  selectedEmoji = '⭐';
  colors = ['#6366f1', '#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#14b8a6'];
  emojis = ['⭐', '💪', '📚', '🧘', '🏃', '💧', '🎯', '🌱', '✍️', '🎨'];
  user = signal<any>(null);

  constructor(
    private habitsService: HabitsService,
    private auth: AuthService
  ) {
    this.user = this.auth.currentUser;
  }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.habitsService.getAll().subscribe({
      next: h => { this.habits.set(h); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  create() {
    if (!this.newName.trim()) return;
    this.habitsService.create({
      name: this.newName,
      description: this.newDesc,
      color: this.selectedColor,
      emoji: this.selectedEmoji
    }).subscribe(() => {
      this.showForm = false;
      this.newName = '';
      this.newDesc = '';
      this.load();
    });
  }

  checkIn(habitId: string) {
    this.habitsService.checkIn(habitId).subscribe(() => this.load());
  }

  getContributions(habit: Habit) {
    return habit.logs.map(l => ({ date: l.date, count: l.count }));
  }

  logout() { this.auth.logout(); }
}
