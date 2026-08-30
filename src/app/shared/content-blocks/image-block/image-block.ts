import { Component, input } from '@angular/core';

import { ImageBlockData } from '../../../core/models/content.model';

@Component({
  selector: 'app-image-block',
  imports: [],
  templateUrl: './image-block.html',
  styleUrl: './image-block.scss',
})
export class ImageBlock {
  readonly data = input.required<ImageBlockData>();
}
