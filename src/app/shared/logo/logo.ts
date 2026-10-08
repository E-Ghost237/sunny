import { Component, input } from '@angular/core';

/** DeLight wordmark with a leaf mark. Pure SVG/text so it stays crisp at any size. */
@Component({
  selector: 'app-logo',
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  host: { '[class.logo--light]': 'light()' },
})
export class Logo {
  readonly light = input(false);
}
