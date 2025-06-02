import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, MatListModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  menuItems = [
    {
      name: 'Dashboard',
      action: () => window.location.href = '/painel',
    },
    {
      name: 'Logout',
      action: () => { localStorage.removeItem('access_token'); window.location.href = '/' },
    }
  ];
}
