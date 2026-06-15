import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: string;
  tag?: string;
  isCompleted: boolean;
  isRecurring: boolean;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class TasksService {
  private apiUrl = 'https://loggd-backend-production.up.railway.app/api/Tasks';

  constructor(private http: HttpClient) {}

  getAll(includeCompleted = false) {
    return this.http.get<TaskItem[]>(`${this.apiUrl}?includeCompleted=${includeCompleted}`);
  }

  create(data: {
    title: string;
    description?: string;
    priority: string;
    tag?: string;
    isRecurring: boolean;
    dueDate?: string;
  }) {
    return this.http.post<TaskItem>(this.apiUrl, data);
  }

  complete(taskId: string) {
    return this.http.post<TaskItem>(`${this.apiUrl}/${taskId}/complete`, {});
  }

  delete(taskId: string) {
    return this.http.delete(`${this.apiUrl}/${taskId}`);
  }
}
