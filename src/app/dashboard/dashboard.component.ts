import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
  ],
})
export class DashboardComponent {
  user: string | null = '';

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.getUser();
  }

  irClientes() {
    this.router.navigate(['/clientes']);
  }

  irProductos() {
    this.router.navigate(['/productos']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
