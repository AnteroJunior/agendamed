import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./auth/components/login-page/login-page').then(m => m.LoginPage)
    },
];
