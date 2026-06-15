import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';

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

  currentUser = signal<User | null>(null);
  isLoggedIn = signal(false);

  constructor(
    private http: HttpClient,
    private router: Router,
    private socialAuth: SocialAuthService
  ) {
    this.loadFromStorage();
  }

  // Login real con Google
  loginWithGoogle() {
    this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID).then(user => {
      this.http.post<{ accessToken: string; user: User }>(
        `${this.apiUrl}/Auth/google`,
        { idToken: user.idToken }
      ).subscribe(response => {
        localStorage.setItem('token', response.accessToken);
        this.currentUser.set(response.user);
        this.isLoggedIn.set(true);
        this.router.navigate(['/habits']);
      });
    });
  }

  // Login de desarrollo
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
