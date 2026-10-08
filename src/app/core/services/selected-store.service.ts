import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'delight-store';
const DEFAULT_STORE = 'riverbend-il';

/** The store the customer is shopping at. Persisted locally, shown in the shop's store bar. */
@Injectable({ providedIn: 'root' })
export class SelectedStoreService {
  readonly slug = signal<string>(this.read());

  set(slug: string): void {
    this.slug.set(slug);
    try {
      localStorage.setItem(STORAGE_KEY, slug);
    } catch {
      // Storage can be blocked; the selection then lasts for this visit only.
    }
  }

  private read(): string {
    try {
      return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_STORE;
    } catch {
      return DEFAULT_STORE;
    }
  }
}
