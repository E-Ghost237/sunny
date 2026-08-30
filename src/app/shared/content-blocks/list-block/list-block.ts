import { Component, input } from '@angular/core';

import { ListBlockData } from '../../../core/models/content.model';

@Component({
  selector: 'app-list-block',
  imports: [],
  templateUrl: './list-block.html',
  styleUrl: './list-block.scss',
})
export class ListBlock {
  readonly data = input.required<ListBlockData>();
}
