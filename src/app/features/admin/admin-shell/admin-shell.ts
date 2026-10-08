import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
})
export class AdminShell {
  protected readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected readonly nav = [
    { path: '/admin', label: 'Dashboard', exact: true },
    { path: '/admin/orders', label: 'Orders', exact: false },
    { path: '/admin/products', label: 'Products', exact: false },
    { path: '/admin/payments', label: 'Payment methods', exact: false },
    { path: '/admin/stores', label: 'Stores', exact: false },
  ];

  protected signOut(): void {
    this.auth.signOut();
    this.router.navigateByUrl('/admin/login');
  }
}
