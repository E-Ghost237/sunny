import { Component, input } from '@angular/core';

@Component({
  selector: 'app-unknown-block',
  imports: [],
  templateUrl: './unknown-block.html',
  styleUrl: './unknown-block.scss',
})
export class UnknownBlock {
  // Escape hatch so an unrecognized block type never blocks rendering the rest of
  // the page -- current extraction never actually emits this type, but future
  // extraction passes (e.g. against the 170 `page` routes' long tail) might.
  readonly data = input.required<Record<string, unknown>>();
}
