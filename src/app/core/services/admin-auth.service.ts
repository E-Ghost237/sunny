import { Injectable, signal } from '@angular/core';

import { environment } from '../../../environments/environment';

const KEY = 'delight-admin-session';

/**
 * Back-office sign-in. Client-side only: it keeps the back-office pages out of the
 * way of customers but is NOT real security. Add server-side authentication before
 * the back-office holds live data.
 */
@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  readonly signedIn = signal<boolean>(this.read());

  signIn(passcode: string): boolean {
    if (passcode.trim() !== environment.adminPasscode) return false;
    this.signedIn.set(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch {
      // Session lasts for this tab only if storage is blocked.
    }
    return true;
  }

  signOut(): void {
    this.signedIn.set(false);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // Nothing to clear.
    }
  }

  private read(): boolean {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch {
      return false;
    }
  }
}
