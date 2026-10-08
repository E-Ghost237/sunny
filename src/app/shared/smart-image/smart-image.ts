import { Component, computed, input, signal } from '@angular/core';

/**
 * Image with a graceful fallback. If the file is missing (or still being
 * generated) the premium gradient fallback is shown instead of a broken icon.
 */
@Component({
  selector: 'app-smart-image',
  templateUrl: './smart-image.html',
  styleUrl: './smart-image.scss',
  host: { '[class.is-loaded]': 'loaded()' },
})
export class SmartImage {
  readonly src = input<string | null | undefined>(null);
  readonly alt = input<string>('');
  readonly eager = input(false);
  /** Horizontal focal point, 0-100 (used by the panorama look-around). */
  readonly focusX = input(50);
  protected readonly position = computed(() => `${this.focusX()}% 50%`);
  readonly failed = signal(false);
  readonly loaded = signal(false);
  protected readonly showImg = computed(() => !!this.src() && !this.failed());
}
