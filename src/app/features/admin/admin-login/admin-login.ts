import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AdminAuthService } from '../../../core/services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule],
  templateUrl: './admin-login.html',
})
export class AdminLogin {
  private readonly auth = inject(AdminAuthService);
  private readonly router = inject(Router);

  protected passcode = '';
  protected readonly error = signal(false);

  constructor() {
    if (this.auth.signedIn()) this.router.navigateByUrl('/admin');
  }

  protected submit(): void {
    if (this.auth.signIn(this.passcode)) {
      this.error.set(false);
      this.router.navigateByUrl('/admin');
    } else {
      this.error.set(true);
    }
  }
}
