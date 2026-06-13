import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HabitsComponent } from './pages/habits/habits';
import { GoalsComponent } from './pages/goals/goals';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'habits',
    loadComponent: () => import('./pages/habits/habits')
      .then(m => m.HabitsComponent)
  },
  {
    path: 'goals',
    loadComponent: () => import('./pages/goals/goals')
      .then(m => m.GoalsComponent)
  }
];
