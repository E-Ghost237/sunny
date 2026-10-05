import { Component, signal } from '@angular/core';

const STORAGE_KEY = 'evergreen-age-confirmed';

@Component({
  selector: 'app-age-gate',
  imports: [],
  templateUrl: './age-gate.html',
  styleUrl: './age-gate.scss',
})
export class AgeGate {
  protected readonly confirmed = signal(this.readConfirmed());
  protected readonly declined = signal(false);

  protected confirm(): void {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      /* storage unavailable — gate will re-prompt next load */
    }
    this.confirmed.set(true);
  }

  protected decline(): void {
    this.declined.set(true);
  }

  private readConfirmed(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }
}
