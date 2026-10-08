import { Component, signal } from '@angular/core';
import { Logo } from '../../shared/logo/logo';

const STORAGE_KEY = 'delight-age-confirmed';

@Component({
  selector: 'app-age-gate',
  imports: [Logo],
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
      /* storage unavailable: the gate re-prompts next load */
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
