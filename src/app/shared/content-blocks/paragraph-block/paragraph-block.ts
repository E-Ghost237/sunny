import { Component, input } from '@angular/core';

import { ParagraphBlockData } from '../../../core/models/content.model';

@Component({
  selector: 'app-paragraph-block',
  imports: [],
  templateUrl: './paragraph-block.html',
  styleUrl: './paragraph-block.scss',
})
export class ParagraphBlock {
  readonly data = input.required<ParagraphBlockData>();
}
