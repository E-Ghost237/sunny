import { Component, input } from '@angular/core';

import { QuoteBlockData } from '../../../core/models/content.model';

@Component({
  selector: 'app-quote-block',
  imports: [],
  templateUrl: './quote-block.html',
  styleUrl: './quote-block.scss',
})
export class QuoteBlock {
  readonly data = input.required<QuoteBlockData>();
}
