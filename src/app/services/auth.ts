import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  level: number;
  totalXP: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://loggd-backend-production.up.railway.app/api';

  // Signal — estado reactivo del usuario actual
  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  // Login de desarrollo (mientras conectamos Google)
  devLogin() {
    return this.http.post<{ accessToken: string; userId: string }>(
      `${this.apiUrl}/Auth/dev-login`, {}
    ).subscribe(response => {
      localStorage.setItem('token', response.accessToken);
      this.isLoggedIn.set(true);
      this.router.navigate(['/habits']);
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private loadFromStorage() {
    const token = this.getToken();
    if (token) this.isLoggedIn.set(true);
  }
}
