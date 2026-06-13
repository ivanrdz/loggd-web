import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate?: string;
  status: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class GoalsService {
  private apiUrl = 'https://loggd-backend-production.up.railway.app/api/Goals';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  create(data: {
    title: string;
    description?: string;
    category: string;
    targetValue?: number;
    unit?: string;
    targetDate?: string;
  }) {
    return this.http.post<Goal>(this.apiUrl, data);
  }

  logProgress(goalId: string, value: number, note?: string) {
    return this.http.post<Goal>(
      `${this.apiUrl}/${goalId}/progress`,
      { value, note }
    );
  }

  getProgressPercent(goal: Goal): number {
    if (!goal.targetValue || goal.targetValue === 0) return 0;
    return Math.min(Math.round(((goal.currentValue ?? 0) / goal.targetValue) * 100), 100);
  }
}
