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

declare const google: any;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://loggd-backend-production.up.railway.app/api';
  private clientId = '972543796013-949qh8juculbvvmfbnnf91ab3c2118s5.apps.googleusercontent.com';

  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  initGoogleLogin(buttonElement: HTMLElement) {
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response: any) => this.handleGoogleResponse(response)
    });
    google.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
      width: 300,
      text: 'continue_with'
    });
  }

  private handleGoogleResponse(response: any) {
    this.http.post<{ accessToken: string; user: User }>(
      `${this.apiUrl}/Auth/google`,
      { idToken: response.credential }
    ).subscribe(result => {
      localStorage.setItem('token', result.accessToken);
      this.currentUser.set(result.user);
      this.isLoggedIn.set(true);
      this.router.navigate(['/habits']);
    });
  }

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
