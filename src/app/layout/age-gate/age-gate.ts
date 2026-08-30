import { Component, signal } from '@angular/core';

const STORAGE_KEY = 'sunnyside-age-confirmed';

@Component({
  selector: 'app-age-gate',
  imports: [],
  templateUrl: './age-gate.html',
  styleUrl: './age-gate.scss',
})
export class AgeGate {
  protected readonly confirmed = signal(localStorage.getItem(STORAGE_KEY) === 'true');
  protected readonly declined = signal(false);

  protected confirm(): void {
    localStorage.setItem(STORAGE_KEY, 'true');
    this.confirmed.set(true);
  }

  protected decline(): void {
    this.declined.set(true);
  }
}
