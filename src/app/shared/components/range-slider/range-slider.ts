import { Component, computed, input, linkedSignal, output } from '@angular/core';

// Dual-handle range slider, ported visually from sunny2's .filt-range-* rules
// (two overlapping native <input type=range> with a styled fill track between
// the thumbs -- same technique as the source, not a new pattern).
@Component({
  selector: 'app-range-slider',
  imports: [],
  templateUrl: './range-slider.html',
  styleUrl: './range-slider.scss',
})
export class RangeSlider {
  readonly boundMin = input.required<number>();
  readonly boundMax = input.required<number>();
  readonly unit = input<string>('%');
  readonly unitPrefix = input(false);
  readonly note = input<string>('');

  readonly rangeChange = output<{ min: number; max: number }>();

  // Resyncs to the bounds whenever they change (e.g. switching category), but
  // stays locally writable while the user drags a handle.
  protected readonly currentMin = linkedSignal(() => this.boundMin());
  protected readonly currentMax = linkedSignal(() => this.boundMax());

  protected readonly fillLeft = computed(() => {
    const span = this.boundMax() - this.boundMin() || 1;
    return ((this.currentMin() - this.boundMin()) / span) * 100;
  });
  protected readonly fillRight = computed(() => {
    const span = this.boundMax() - this.boundMin() || 1;
    return 100 - ((this.currentMax() - this.boundMin()) / span) * 100;
  });

  protected label(value: number): string {
    return this.unitPrefix() ? `${this.unit()}${value}` : `${value}${this.unit()}`;
  }

  protected onMinInput(value: string): void {
    const v = Math.min(Number(value), this.currentMax());
    this.currentMin.set(v);
    this.emit();
  }

  protected onMaxInput(value: string): void {
    const v = Math.max(Number(value), this.currentMin());
    this.currentMax.set(v);
    this.emit();
  }

  private emit(): void {
    this.rangeChange.emit({ min: this.currentMin(), max: this.currentMax() });
  }
}
