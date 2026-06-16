import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HabitsComponent } from './pages/habits/habits';
import { GoalsComponent } from './pages/goals/goals';
import { authGuard } from './guards/auth-guard';
import { TasksComponent } from './pages/tasks/tasks';
import { LayoutComponent } from './components/layout/layout';
import { ProfileComponent } from './pages/profile/profile'

export const routes: Routes = [
  { path: '', redirectTo: 'habits', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login')
      .then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./components/layout/layout')
      .then(m => m.LayoutComponent),
      children: [
        {
          path: 'habits',
          loadComponent: () => import('./pages/habits/habits')
            .then(m => m.HabitsComponent)
        },
        {
          path: 'goals',
          loadComponent: () => import('./pages/goals/goals')
            .then(m => m.GoalsComponent)
        },
        {
          path: 'tasks',
          loadComponent: () => import('./pages/tasks/tasks')
            .then(m => m.TasksComponent)
        },
        {
          path: 'profile',
          loadComponent: () => import('./pages/profile/profile')
            .then(m => m.ProfileComponent)
        }
      ]
  }
];
