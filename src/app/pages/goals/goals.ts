import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Goal, GoalsService } from '../../services/goals';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="main">
      <div class="topbar">
        <h2>Goals</h2>
        <button class="btn-primary" (click)="showForm = !showForm">
          + New goal
        </button>
      </div>

      @if (showForm) {
        <div class="form-card">
          <input class="input" placeholder="Goal title" [(ngModel)]="newTitle" />
          <input class="input" placeholder="Description (optional)" [(ngModel)]="newDesc" />
          <div class="row">
            <select class="input" [(ngModel)]="newCategory">
              @for (c of categories; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
            <input class="input" placeholder="Target (e.g. 25000)" [(ngModel)]="newTarget" type="number" />
            <input class="input" placeholder="Unit (e.g. USD)" [(ngModel)]="newUnit" />
          </div>
          <input class="input" type="date" [(ngModel)]="newDate" />
          <div class="form-actions">
            <button class="btn-ghost" (click)="showForm = false">Cancelar</button>
            <button class="btn-primary" (click)="create()">Guardar</button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Cargando metas...</div>
      }

      <div class="goals-list">
        @for (goal of goals(); track goal.id) {
          <div class="goal-card">
            <div class="goal-top">
              <div class="goal-left">
                <span class="goal-icon">{{ getCategoryIcon(goal.category) }}</span>
                <div>
                  <div class="goal-title">{{ goal.title }}</div>
                  @if (goal.description) {
                    <div class="goal-desc">{{ goal.description }}</div>
                  }
                  <div class="goal-meta">
                    {{ goal.category }}
                    @if (goal.targetDate) {
                      · {{ goal.targetDate | date:'mediumDate' }}
                    }
                  </div>
                </div>
              </div>
              <div class="goal-right">
                <div class="goal-values">
                  <span class="current-val">
                    {{ goal.currentValue | number }}
                  </span>
                  @if (goal.targetValue) {
                    <span class="target-val">
                      / {{ goal.targetValue | number }} {{ goal.unit }}
                    </span>
                  }
                </div>
                <div class="percent">{{ getPercent(goal) }}%</div>
              </div>
            </div>

            <!-- Progress bar -->
            <div class="progress-track">
              <div class="progress-fill"
                [style.width.%]="getPercent(goal)"
                [class.completed]="goal.status === '1'">
              </div>
            </div>

            <!-- Log progress -->
            @if (!isCompleted(goal)) {
              <div class="log-row">
                <input
                  class="input small"
                  type="number"
                  placeholder="Log progress..."
                  [(ngModel)]="progressInputs[goal.id]" />
                <button class="btn-log" (click)="logProgress(goal)">
                  Update
                </button>
              </div>
            } @else {
              <div class="completed-banner">
                🎉 ¡Meta alcanzada! 🌟⭐🌟
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .main { padding: 2rem; max-width: 800px; }
    .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .topbar h2 { font-size: 1.5rem; font-weight: 600; }
    .btn-primary { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.95rem; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-ghost { background: transparent; border: 1px solid #333; color: #aaa; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .form-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .input { background: #0a0a14; border: 1px solid #1e1e32; color: #e2e2e2; padding: 10px 14px; border-radius: 8px; font-size: 0.95rem; outline: none; width: 100%; }
    .input:focus { border-color: #6366f1; }
    .input.small { width: 180px; }
    .row { display: flex; gap: 8px; }
    .row .input { flex: 1; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .goals-list { display: flex; flex-direction: column; gap: 1rem; }
    .goal-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 14px; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .goal-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .goal-left { display: flex; gap: 12px; align-items: flex-start; }
    .goal-icon { font-size: 1.75rem; }
    .goal-title { font-weight: 600; font-size: 1rem; }
    .goal-desc { font-size: 0.82rem; color: #666; margin-top: 2px; }
    .goal-meta { font-size: 0.8rem; color: #555; margin-top: 4px; }
    .goal-right { text-align: right; }
    .goal-values { display: flex; align-items: baseline; gap: 4px; justify-content: flex-end; }
    .current-val { font-size: 1.4rem; font-weight: 700; }
    .target-val { font-size: 0.85rem; color: #666; }
    .percent { font-size: 0.85rem; color: #6366f1; font-weight: 600; margin-top: 2px; }
    .progress-track { background: #1a1a2e; border-radius: 4px; height: 6px; overflow: hidden; }
    .progress-fill { height: 100%; background: #6366f1; border-radius: 4px; transition: width 0.4s ease; }
    .progress-fill.completed { background: #22c55e; }
    .log-row { display: flex; gap: 8px; align-items: center; }
    .btn-log { background: #1a1a2e; border: 1px solid #2e2e4e; color: #e2e2e2; padding: 8px 16px; border-radius: 8px; cursor: pointer; white-space: nowrap; }
    .btn-log:hover { border-color: #6366f1; color: #6366f1; }
    .loading { color: #666; padding: 2rem; text-align: center; }
    .completed-banner { text-align: center; padding: 10px; background: #1a2d1a; border: 1px solid #22c55e; border-radius: 8px; color: #22c55e; font-weight: 600; font-size: 0.95rem; animation: pulse 1.5s ease-in-out infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `]
})
export class GoalsComponent implements OnInit {
  goals = signal<Goal[]>([]);
  loading = signal(false);
  showForm = false;
  progressInputs: Record<string, number> = {};

  newTitle = '';
  newDesc = '';
  newCategory = 'Growth';
  newTarget: number | null = null;
  newUnit = '';
  newDate = '';

  categories = ['Career', 'Health', 'Financial', 'Growth'];

  constructor(private goalsService: GoalsService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.goalsService.getAll().subscribe({
      next: g => { this.goals.set(g); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  create() {
    if (!this.newTitle.trim()) return;
    this.goalsService.create({
      title: this.newTitle,
      description: this.newDesc,
      category: this.newCategory,
      targetValue: this.newTarget ?? undefined,
      unit: this.newUnit,
      targetDate: this.newDate ? new Date(this.newDate).toISOString() : undefined
    }).subscribe(() => {
      this.showForm = false;
      this.newTitle = '';
      this.newDesc = '';
      this.newTarget = null;
      this.newUnit = '';
      this.newDate = '';
      this.load();
    });
  }

  logProgress(goal: Goal) {
    const value = this.progressInputs[goal.id];
    if (value == null) return;
    this.goalsService.logProgress(goal.id, value).subscribe(() => {
      this.progressInputs[goal.id] = 0;
      this.load();
    });
  }

  getPercent(goal: Goal): number {
    return this.goalsService.getProgressPercent(goal);
  }

  getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      Career: '💼', Health: '💪', Financial: '💰', Growth: '🌱'
    };
    return icons[category] ?? '🎯';
  }

  isCompleted(goal: Goal): boolean {
    if (!goal.targetValue) return false;
    return (goal.currentValue ?? 0) >= goal.targetValue;
  }
}
