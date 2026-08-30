import { Component, input, linkedSignal } from '@angular/core';

// Generic collapsible section, ported from sunny2's .filt-acc/.pd-acc pattern
// (both are the same toggle-chevron behavior with slightly different visual
// contexts) -- used by the shop filter sidebar and the product-detail page.
@Component({
  selector: 'app-accordion',
  imports: [],
  templateUrl: './accordion.html',
  styleUrl: './accordion.scss',
})
export class Accordion {
  readonly title = input.required<string>();
  readonly startOpen = input(false);
  readonly variant = input<'filter' | 'detail'>('filter');

  // A plain `signal(this.startOpen())` would snapshot the input's default value
  // before Angular applies the real bound value (inputs are set post-construction),
  // so `[startOpen]="true"` would silently be ignored on first render. linkedSignal
  // re-derives from the input reactively, avoiding that timing gap.
  protected readonly open = linkedSignal(() => this.startOpen());

  protected toggle(): void {
    this.open.update((v) => !v);
  }
}
