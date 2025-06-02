import { Routes } from '@angular/router';
import { dashboardGuard } from './dashboard/guards/dashboard-guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth/login/login').then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register').then(m => m.Register)
    },
    {
        path: 'painel',
        canActivate: [dashboardGuard],
        loadComponent: () => import('./dashboard/dashboard/dashboard').then(m => m.Dashboard),
    }
];
