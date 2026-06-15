import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HabitsComponent } from './pages/habits/habits';
import { GoalsComponent } from './pages/goals/goals';
import { authGuard } from './guards/auth-guard';
import { TasksComponent } from './pages/tasks/tasks';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: 'habits',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/habits/habits')
      .then(m => m.HabitsComponent)
  },
  {
    path: 'goals',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/goals/goals')
      .then(m => m.GoalsComponent)
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/tasks/tasks')
      .then(m => m.TasksComponent)
  }
];
