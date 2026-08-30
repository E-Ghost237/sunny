import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Product } from '../../../core/models/product.model';
import { ProductImage } from '../../../shared/components/product-image/product-image';

const STRAIN_TAG_CLASS: Record<string, string> = {
  Indica: 'tag-ind',
  Sativa: 'tag-sat',
  Hybrid: 'tag-hyb',
  CBD: 'tag-cbd',
};

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ProductImage],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();

  protected readonly onSale = computed(() => {
    const p = this.product();
    return p.discountedPrice != null && p.discountedPrice !== p.price;
  });

  protected readonly strainTagClass = computed(() => STRAIN_TAG_CLASS[this.product().strain ?? ''] ?? 'tag-hyb');

  protected readonly potencyLabel = computed(() => {
    const p = this.product();
    const bits: string[] = [];
    if (p.thc) bits.push(`THC: ${p.thc}`);
    if (p.cbd) bits.push(`CBD: ${p.cbd}`);
    if (p.cbn) bits.push(`CBN: ${p.cbn}`);
    return bits.join('  ');
  });

  protected readonly showSize = computed(() => this.product().category !== 'accessories' && !!this.product().size);
  protected readonly showTags = computed(
    () => this.product().category !== 'accessories' && (!!this.product().strain || !!this.potencyLabel()),
  );
}
