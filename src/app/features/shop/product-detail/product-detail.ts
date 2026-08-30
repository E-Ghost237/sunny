import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { ProductCategory } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ContentService } from '../../../core/services/content.service';
import { QuantityStepper } from '../../../shared/components/quantity-stepper/quantity-stepper';
import { ProductImage } from '../../../shared/components/product-image/product-image';
import { ProductCard } from '../product-card/product-card';
import { Accordion } from '../../../shared/components/accordion/accordion';
import { CATEGORY_EMOJI } from '../../../shared/constants/category-emoji';

// Ported from sunny2's ONSET_DURATION constant -- generic category-level reference
// info, not per-product fabricated data.
const ONSET_DURATION: Record<string, [string, string]> = {
  flower: ['< 7 minutes', '1 - 3 hours or longer'],
  prerolls: ['< 7 minutes', '1 - 3 hours or longer'],
  vapes: ['2 - 10 minutes', '1 - 3 hours'],
  concentrates: ['< 5 minutes', '1 - 3 hours'],
  edibles: ['30 - 90 minutes', '4 - 8 hours or longer'],
  beverages: ['15 - 45 minutes', '2 - 4 hours'],
  tinctures: ['15 - 45 minutes (sublingual)', '2 - 4 hours'],
  capsules: ['30 - 90 minutes', '4 - 8 hours'],
  topicals: ['5 - 15 minutes', '2 - 4 hours (localized)'],
};

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, QuantityStepper, ProductImage, ProductCard, Accordion],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly contentService = inject(ContentService);
  protected readonly authService = inject(AuthService);

  readonly category = input.required<ProductCategory>();
  readonly productSlug = input.required<string>();

  protected readonly productResource = rxResource({
    params: () => ({ category: this.category(), slug: this.productSlug() }),
    stream: ({ params }) => this.productService.getProductBySlug(params.category, params.slug),
  });

  protected readonly product = computed(() => this.productResource.value()?.[0] ?? null);

  protected readonly onSale = computed(() => {
    const p = this.product();
    return !!p && p.discountedPrice != null && p.discountedPrice < p.price;
  });

  protected readonly onsetDuration = computed(() => ONSET_DURATION[this.category()] ?? null);

  // Gallery
  protected readonly activeImageIndex = signal(0);
  protected readonly galleryImages = computed(() => {
    const p = this.product();
    if (!p) return [];
    // De-dupe -- most products only have one *real* distinct image, the rest of
    // the array is placeholder repeats from the source data.
    return [...new Set(p.images)];
  });

  protected shiftImage(delta: number): void {
    const len = this.galleryImages().length;
    if (len === 0) return;
    this.activeImageIndex.update((i) => (i + delta + len) % len);
  }

  protected readonly quantity = signal(1);
  protected readonly justAdded = signal(false);

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;

    const metaBits: string[] = [];
    if (p.strain) metaBits.push(p.strain);
    if (p.thc) metaBits.push(`${p.thc} THC`);

    this.cartService.add(
      {
        productId: p.id,
        slug: p.slug,
        category: p.category,
        name: p.name,
        brand: p.brand,
        image: p.images[0],
        meta: metaBits.join(' · '),
        priceAtAdd: p.discountedPrice ?? p.price,
      },
      this.quantity(),
    );

    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 2000);
  }

  // Related products: same category, excluding the current product.
  private readonly categoryProductsResource = rxResource({
    params: () => ({ category: this.category() }),
    stream: ({ params }) => this.productService.getProductsByCategory(params.category),
  });
  protected readonly relatedProducts = computed(() => {
    const current = this.product();
    return (this.categoryProductsResource.value() ?? []).filter((p) => p.id !== current?.id).slice(0, 5);
  });

  // Learn banner cross-promo -- picks a real article deterministically from the
  // product id so it's stable per product rather than shuffling on every render.
  private readonly articlesResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
  protected readonly bannerArticle = computed(() => {
    const articles = this.articlesResource.value() ?? [];
    if (articles.length === 0) return null;
    const p = this.product();
    const idx = p ? p.id % articles.length : 0;
    return articles[idx];
  });
  protected readonly categoryEmoji = computed(() => CATEGORY_EMOJI[this.category()] ?? '🌿');
}
