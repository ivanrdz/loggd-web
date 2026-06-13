import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  count: number;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  emoji: string;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  createdAt: string;
  logs: HabitLog[];
}

export interface ContributionDay {
  date: string;
  count: number;
}

@Injectable({ providedIn: 'root' })
export class HabitsService {
  private apiUrl = 'https://loggd-backend-production.up.railway.app/api/Habits';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Habit[]>(this.apiUrl);
  }

  create(data: { name: string; description?: string; color: string; emoji: string }) {
    return this.http.post<Habit>(this.apiUrl, data);
  }

  checkIn(habitId: string) {
    return this.http.post<Habit>(`${this.apiUrl}/${habitId}/checkin`, {});
  }

  getContributions(habitId: string, year?: number) {
    const y = year ?? new Date().getFullYear();
    return this.http.get<ContributionDay[]>(
      `${this.apiUrl}/${habitId}/contributions?year=${y}`
    );
  }
}
