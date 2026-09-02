import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'quiz',
    loadComponent: () => import('./quiz/quiz.page').then( m => m.QuizPage)
  },
  {
    path: 'stats',
    loadComponent: () => import('./stats/stats.page').then( m => m.StatsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'hoy',
    loadComponent: () => import('./hoy/hoy.page').then( m => m.HoyPage)
  },
  {
    path: 'fuente',
    loadComponent: () => import('./fuente/fuente.page').then( m => m.FuentePage)
  },

];
