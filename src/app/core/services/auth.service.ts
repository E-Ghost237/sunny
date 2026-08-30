import { Injectable, computed, effect, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

import { CheckEmailResponse, User } from '../models/auth.model';

const SESSION_KEY = 'sunnyside-auth-user';
const REGISTRY_KEY = 'sunnyside-auth-registry'; // local stand-in for a real user database

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function loadRegistry(): Record<string, User> {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    return raw ? (JSON.parse(raw) as Record<string, User>) : {};
  } catch {
    return {};
  }
}

/**
 * There's no real backend yet, so this simulates one locally (localStorage as the
 * "user database") while keeping the exact request/response shapes the real API
 * uses -- confirmed from sunny/har_reference/auth_check_patient_email_samples.json
 * for checkEmail. register/login have no captured real contract (no such traffic in
 * the HARs), so their shapes are reasonable invented equivalents. Swapping this
 * service's internals for real HttpClient calls later shouldn't require touching
 * any component that consumes it.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<User | null>(loadSession());
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    effect(() => {
      const user = this._user();
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    });
  }

  checkEmail(email: string): Observable<CheckEmailResponse> {
    const registry = loadRegistry();
    const isRegistered = email.toLowerCase() in registry;
    return of({
      success: true,
      can_register: !isRegistered,
      is_registered: isRegistered,
      error: null,
    }).pipe(delay(300));
  }

  register(details: { email: string; firstName: string; lastName: string; phone: string | null }): Observable<User> {
    const registry = loadRegistry();
    const user: User = {
      id: crypto.randomUUID(),
      email: details.email,
      firstName: details.firstName,
      lastName: details.lastName,
      phone: details.phone,
      rewardsPoints: 0,
    };
    registry[details.email.toLowerCase()] = user;
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
    this._user.set(user);
    return of(user).pipe(delay(300));
  }

  login(email: string): Observable<User | null> {
    const registry = loadRegistry();
    const user = registry[email.toLowerCase()] ?? null;
    if (user) {
      this._user.set(user);
    }
    return of(user).pipe(delay(300));
  }

  addRewardsPoints(points: number): void {
    const user = this._user();
    if (!user) return;
    const updated = { ...user, rewardsPoints: user.rewardsPoints + points };
    this._user.set(updated);
    const registry = loadRegistry();
    registry[user.email.toLowerCase()] = updated;
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  }

  logout(): void {
    this._user.set(null);
  }
}
