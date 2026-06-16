import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, TaskItem } from '../../services/tasks';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="main">
      <div class="topbar">
        <h2>Tasks</h2>
        <div class="topbar-actions">
          <label class="toggle-completed">
            <input type="checkbox" [(ngModel)]="showCompleted" (change)="load()">
            Mostrar completadas
          </label>
          <button class="btn-primary" (click)="showForm = !showForm">
            + New task
          </button>
        </div>
      </div>

      @if (showForm) {
        <div class="form-card">
          <input class="input" placeholder="Task title" [(ngModel)]="newTitle" />
          <input class="input" placeholder="Description (optional)" [(ngModel)]="newDesc" />
          <div class="row">
            <select class="input" [(ngModel)]="newPriority">
              @for (p of priorities; track p) {
                <option [value]="p">{{ p }}</option>
              }
            </select>
            <input class="input" placeholder="Tag (Work, Personal...)" [(ngModel)]="newTag" />
            <input class="input" type="date" [(ngModel)]="newDueDate" />
          </div>
          <label class="checkbox-row">
            <input type="checkbox" [(ngModel)]="newRecurring">
            Tarea recurrente
          </label>
          <div class="form-actions">
            <button class="btn-ghost" (click)="showForm = false">Cancelar</button>
            <button class="btn-primary" (click)="create()">Guardar</button>
          </div>
        </div>
      }

      @if (loading()) {
        <div class="loading">Cargando tareas...</div>
      }

      <div class="section">
        <div class="tasks-list">
          @for (task of pendingTasks(); track task.id) {
            <div class="task-card" [class.completed]="task.isCompleted">
              <button class="check-btn" (click)="complete(task.id)">
                {{ task.isCompleted ? '✅' : '⬜' }}
              </button>
              <div class="task-info">
                <div class="task-title">{{ task.title }}</div>
                @if (task.description) {
                  <div class="task-desc">{{ task.description }}</div>
                }
                <div class="task-meta">
                  <span class="tag priority-{{ getPriorityClass(task.priority) }}">
                    {{ getPriorityLabel(task.priority) }}
                  </span>
                  @if (task.tag) {
                    <span class="tag">{{ task.tag }}</span>
                  }
                  @if (task.isRecurring) {
                    <span class="tag">🔁 Recurrente</span>
                  }
                  @if (task.dueDate) {
                    <span class="tag due">📅 {{ task.dueDate | date:'mediumDate' }}</span>
                  }
                </div>
              </div>
              <button class="delete-btn" (click)="delete(task.id)">🗑</button>
            </div>
          }
          @if (pendingTasks().length === 0 && !loading()) {
            <div class="empty">No hay tareas pendientes 🎉</div>
          }
        </div>
      </div>

      @if (showCompleted && completedTasks().length > 0) {
        <div class="section">
          <h3 class="section-title">Completadas</h3>
          <div class="tasks-list">
            @for (task of completedTasks(); track task.id) {
              <div class="task-card completed">
                <button class="check-btn" (click)="complete(task.id)">✅</button>
                <div class="task-info">
                  <div class="task-title">{{ task.title }}</div>
                </div>
                <button class="delete-btn" (click)="delete(task.id)">🗑</button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .main { padding: 2rem; max-width: 800px; }
    .topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .topbar h2 { font-size: 1.5rem; font-weight: 600; }
    .topbar-actions { display: flex; align-items: center; gap: 1rem; }
    .toggle-completed { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #666; cursor: pointer; }
    .btn-primary { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-size: 0.95rem; }
    .btn-primary:hover { background: #4f46e5; }
    .btn-ghost { background: transparent; border: 1px solid #333; color: #aaa; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
    .form-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .input { background: #0a0a14; border: 1px solid #1e1e32; color: #e2e2e2; padding: 10px 14px; border-radius: 8px; font-size: 0.95rem; outline: none; width: 100%; }
    .input:focus { border-color: #6366f1; }
    .row { display: flex; gap: 8px; }
    .row .input { flex: 1; }
    .checkbox-row { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #aaa; cursor: pointer; }
    .form-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .section { margin-bottom: 1.5rem; }
    .section-title { font-size: 0.85rem; color: #555; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
    .tasks-list { display: flex; flex-direction: column; gap: 8px; }
    .task-card { background: #0f0f1a; border: 1px solid #1e1e32; border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: center; gap: 12px; transition: border-color 0.15s; }
    .task-card:hover { border-color: #2e2e4e; }
    .task-card.completed { opacity: 0.5; }
    .check-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; padding: 0; flex-shrink: 0; }
    .task-info { flex: 1; }
    .task-title { font-size: 0.95rem; font-weight: 500; color: #e2e2e2; }
    .task-card.completed .task-title { text-decoration: line-through; color: #555; }
    .task-desc { font-size: 0.82rem; color: #666; margin-top: 2px; }
    .task-meta { display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap; }
    .tag { font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; background: #1a1a2e; color: #666; border: 1px solid #1e1e32; }
    .priority-high { background: #2d1a1a; color: #ef4444; border-color: #3d1a1a; }
    .priority-urgent { background: #2d1a1a; color: #f97316; border-color: #3d1a1a; }
    .priority-medium { background: #1a1a2d; color: #6366f1; border-color: #1e1e3d; }
    .priority-low { background: #1a2d1a; color: #22c55e; border-color: #1e3d1e; }
    .due { color: #f59e0b; border-color: #2d2a1a; }
    .delete-btn { background: none; border: none; font-size: 1rem; cursor: pointer; opacity: 0.3; padding: 0; flex-shrink: 0; }
    .delete-btn:hover { opacity: 1; }
    .empty { color: #444; text-align: center; padding: 2rem; font-size: 0.9rem; }
    .loading { color: #666; padding: 2rem; text-align: center; }
  `]
})
export class TasksComponent implements OnInit {
  tasks = signal<TaskItem[]>([]);
  loading = signal(false);
  showForm = false;
  showCompleted = false;

  newTitle = '';
  newDesc = '';
  newPriority = 'Medium';
  newTag = '';
  newDueDate = '';
  newRecurring = false;

  priorities = ['Low', 'Medium', 'High', 'Urgent'];

  pendingTasks = () => this.tasks().filter(t => !t.isCompleted);
  completedTasks = () => this.tasks().filter(t => t.isCompleted);

  constructor(private tasksService: TasksService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.tasksService.getAll(this.showCompleted).subscribe({
      next: t => { this.tasks.set(t); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  create() {
    if (!this.newTitle.trim()) return;
    this.tasksService.create({
      title: this.newTitle,
      description: this.newDesc,
      priority: this.newPriority,
      tag: this.newTag,
      isRecurring: this.newRecurring,
      dueDate: this.newDueDate ? new Date(this.newDueDate).toISOString() : undefined
    }).subscribe(() => {
      this.showForm = false;
      this.newTitle = '';
      this.newDesc = '';
      this.newTag = '';
      this.newDueDate = '';
      this.newRecurring = false;
      this.load();
    });
  }

  complete(taskId: string) {
    this.tasksService.complete(taskId).subscribe(() => this.load());
  }

  delete(taskId: string) {
    this.tasksService.delete(taskId).subscribe(() => this.load());
  }

  getPriorityClass(priority: any): string {
    if (typeof priority === 'number') {
      const map: Record<number, string> = { 0: 'low', 1: 'medium', 2: 'high', 3: 'urgent' };
      return map[priority] ?? 'medium';
    }
    return priority.toLowerCase();
  }

  getPriorityLabel(priority: any): string {
    if (typeof priority === 'number') {
      const map: Record<number, string> = { 0: 'Low', 1: 'Medium', 2: 'High', 3: 'Urgent' };
      return map[priority] ?? 'Medium';
    }
    return priority;
  }
}
