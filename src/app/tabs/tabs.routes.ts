import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'hoy',
        loadComponent: () =>
          import('../hoy/hoy.page').then((m) => m.HoyPage),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'quiz',
        loadComponent: () =>
          import('../quiz/quiz.page').then((m) => m.QuizPage),
      },
      {
        path: 'fuente',
        loadComponent: () =>
          import('../fuente/fuente.page').then((m) => m.FuentePage),
      },
/*       {
        path: 'stats',
        loadComponent: () =>
          import('../stats/stats.page').then((m) => m.StatsPage),
      }, */
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.page').then((m) => m.SettingsPage),
      },

      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/fuente',
    pathMatch: 'full',
  },
];
