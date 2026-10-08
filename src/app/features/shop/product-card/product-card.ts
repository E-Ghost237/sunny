import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { productImage } from '../../../shared/utils/media';

const STRAIN_TAG_CLASS: Record<string, string> = {
  Indica: 'tag--dark',
  Sativa: 'tag--gold',
  Hybrid: 'tag--leaf',
  CBD: 'tag--outline',
};

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, SmartImage],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();

  protected readonly image = computed(() => productImage(this.product()));

  protected readonly onSale = computed(() => {
    const p = this.product();
    return p.discountedPrice != null && p.discountedPrice !== p.price;
  });

  protected readonly strainTagClass = computed(
    () => `tag ${STRAIN_TAG_CLASS[this.product().strain ?? ''] ?? 'tag--leaf'}`,
  );

  protected readonly potency = computed(() => {
    const p = this.product();
    const bits: string[] = [];
    if (p.thc) bits.push(`THC ${p.thc}`);
    if (p.cbd) bits.push(`CBD ${p.cbd}`);
    return bits.join(' · ');
  });

  protected readonly showSize = computed(() => this.product().category !== 'accessories' && !!this.product().size);
}
