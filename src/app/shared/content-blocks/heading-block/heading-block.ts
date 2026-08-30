import { Component, input } from '@angular/core';

import { HeadingBlockData } from '../../../core/models/content.model';

@Component({
  selector: 'app-heading-block',
  imports: [],
  templateUrl: './heading-block.html',
  styleUrl: './heading-block.scss',
})
export class HeadingBlock {
  readonly data = input.required<HeadingBlockData>();
}
