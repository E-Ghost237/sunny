import { Component, computed, input } from '@angular/core';

import { CATEGORY_EMOJI } from '../../constants/category-emoji';

const PLACEHOLDER_PREFIX = '/assets/placeholder/';

@Component({
  selector: 'app-product-image',
  imports: [],
  templateUrl: './product-image.html',
  styleUrl: './product-image.scss',
})
export class ProductImage {
  readonly src = input<string>('');
  readonly alt = input<string>('');
  readonly category = input<string>('');

  protected readonly isPlaceholder = computed(() => !this.src() || this.src().startsWith(PLACEHOLDER_PREFIX));
  protected readonly emoji = computed(() => CATEGORY_EMOJI[this.category()] ?? '🌿');
}
