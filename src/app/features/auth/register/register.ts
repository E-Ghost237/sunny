import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected email = '';
  protected firstName = '';
  protected lastName = '';
  protected phone = '';

  protected submit(): void {
    if (!this.email || !this.firstName || !this.lastName) return;
    this.auth
      .register({ email: this.email, firstName: this.firstName, lastName: this.lastName, phone: this.phone || null })
      .subscribe(() => this.router.navigate(['/account']));
  }
}
