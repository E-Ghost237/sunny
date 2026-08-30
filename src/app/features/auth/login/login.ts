import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

type Step = 'email' | 'signin' | 'create';

// Ports sunny2's loginBack/loginContinue step-flow, but now branches on the real
// check-patient-email contract's `is_registered` field (sunny2's prototype always
// went straight to "create account" -- it never modeled an existing-user path).
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly step = signal<Step>('email');
  protected readonly checking = signal(false);
  protected readonly error = signal<string | null>(null);

  protected email = '';
  protected password = '';
  protected firstName = '';
  protected lastName = '';
  protected phone = '';

  protected continueFromEmail(): void {
    if (!this.email) return;
    this.checking.set(true);
    this.error.set(null);
    this.auth.checkEmail(this.email).subscribe((res) => {
      this.checking.set(false);
      this.step.set(res.is_registered ? 'signin' : 'create');
    });
  }

  protected back(): void {
    this.step.set('email');
    this.error.set(null);
  }

  protected submitSignIn(): void {
    this.auth.login(this.email).subscribe((user) => {
      if (user) {
        this.router.navigate(['/account']);
      } else {
        this.error.set("We couldn't find that account. Try creating one instead.");
      }
    });
  }

  protected submitCreate(): void {
    this.auth
      .register({ email: this.email, firstName: this.firstName, lastName: this.lastName, phone: this.phone || null })
      .subscribe(() => this.router.navigate(['/account']));
  }
}
