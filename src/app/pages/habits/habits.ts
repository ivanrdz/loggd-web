import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitsService, Habit } from '../../services/habits';
import { ContributionGraph } from '../../components/contribution-graph/contribution-graph';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, FormsModule, ContributionGraph],
  template: `
    <div class="container">
      <div class="topbar">
        <h2>Habits</h2>
        <button class="btn-primary" (click)="showForm = !showForm">
          + New habit
        </button>
      </div>

      @if (showForm) {
        <div class="form-card">
          <input class="input" placeholder="Habit name" [(ngModel)]="newName" />
          <input class="input" placeholder="Description (optional)" [(ngModel)]="newDesc" />
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

      @if (loading()) {
        <div class="loading">Cargando hábitos...</div>
      }

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
                  [style.background]="hasCheckedInToday(habit) ? '#1a1a2e' : habit.color"
                  [style.border]="hasCheckedInToday(habit) ? '1px solid ' + habit.color : 'none'"
                  [style.color]="hasCheckedInToday(habit) ? habit.color : 'white'"
                  [disabled]="hasCheckedInToday(habit)"
                  (click)="checkIn(habit.id)">
                  {{ hasCheckedInToday(habit) ? '✅ Done' : 'Check in' }}
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
    </div>
  `,
  styles: [`
    .container { padding: 1.25rem; max-width: 100%; overflow-x: hidden; }
    .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .topbar h2 { font-size: 1.5rem; font-weight: 600; color: #e2e2e2; }
    .btn-primary { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.95rem; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-ghost { background: transparent; border: 1px solid #333; color: #aaa; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .form-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .input { background: #0a0a14; border: 1px solid #1e1e32; color: #e2e2e2; padding: 10px 14px; border-radius: 8px; font-size: 0.95rem; outline: none; }
    .input:focus { border-color: #6366f1; }
    .label { font-size: 0.85rem; color: #666; }
    .color-row, .emoji-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .color-dot { width: 22px; height: 22px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: transform 0.1s; }
    .color-dot.selected { border-color: white; transform: scale(1.2); }
    .emoji-opt { font-size: 1.3rem; cursor: pointer; padding: 4px; border-radius: 6px; border: 2px solid transparent; }
    .emoji-opt.selected { border-color: #6366f1; background: #1a1a2e; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .habits-list { display: flex; flex-direction: column; gap: 1rem; }
    .habit-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 14px; padding: 1.25rem 1.5rem; transition: border-color 0.15s; overflow: hidden; }
    .habit-card:hover { border-color: #2e2e4e; }
    .habit-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .habit-left { display: flex; align-items: center; gap: 12px; }
    .habit-emoji { font-size: 1.75rem; }
    .habit-name { font-weight: 600; font-size: 1rem; color: #e2e2e2; }
    .habit-desc { font-size: 0.82rem; color: #666; margin-top: 2px; }
    .habit-right { display: flex; align-items: center; gap: 1.5rem; }
    .stat { display: flex; flex-direction: column; align-items: center; }
    .stat-value { font-size: 1.1rem; font-weight: 700; color: #e2e2e2; }
    .stat-label { font-size: 0.72rem; color: #666; }
    .btn-checkin { border: none; color: white; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: opacity 0.15s; }
    .btn-checkin:hover { opacity: 0.85; }
    .loading { color: #666; padding: 2rem; text-align: center; }
    .btn-checkin:disabled { opacity: 0.7; cursor: not-allowed; }
    .graph-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; padding-top: 4px; margin: 0 -1.5rem; padding: 4px 1.5rem 0; }
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

  constructor(private habitsService: HabitsService) {}

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

  hasCheckedInToday(habit: Habit): boolean {
    const today = new Date().toISOString().split('T')[0];
    return habit.logs.some(l => l.date.startsWith(today));
  }
}
