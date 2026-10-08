import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { ContentService } from '../../../core/services/content.service';
import { ProductCard } from '../../shop/product-card/product-card';
import { ContentBlock } from '../../../core/models/content.model';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { categoryImage, storeImage } from '../../../shared/utils/media';
import { SHOP_CATEGORIES } from '../../../layout/cat-bar/cat-bar';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';

interface FaqItem {
  question: string;
  answerBlocks: ContentBlock[];
}

function groupFaqBlocks(blocks: ContentBlock[]): FaqItem[] {
  const items: FaqItem[] = [];
  let current: FaqItem | null = null;
  for (const block of blocks) {
    if (block.type === 'heading') {
      const level = (block.data as { level: number }).level;
      if (level === 4) {
        current = { question: (block.data as { text: string }).text, answerBlocks: [] };
        items.push(current);
        continue;
      }
      current = null;
      continue;
    }
    current?.answerBlocks.push(block);
  }
  return items;
}

const TRUST_POINTS = [
  'Lab-tested batches',
  'Full COA on every product',
  'Discreet, recyclable packaging',
  'Pickup or shipping',
  'Licensed partner dispensaries',
  'Real human support',
];

const MARKET_CARDS = [
  { flag: '🇺🇸', title: 'United States', body: 'Pickup at our locations and shipping where licensed.', link: '/stores' },
  { flag: '🇨🇦', title: 'Canada', body: 'Shipping to every province, with provincial rules respected.', link: '/shop' },
  { flag: '🇪🇺', title: 'Europe', body: 'Shipping to selected EU countries where permitted.', link: '/shop' },
];

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard, SmartImage, Reveal, ContentPageRenderer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly productService = inject(ProductService);
  private readonly storeService = inject(StoreService);
  private readonly contentService = inject(ContentService);

  protected readonly trustPoints = TRUST_POINTS;
  protected readonly marketCards = MARKET_CARDS;
  protected readonly categories = SHOP_CATEGORIES;
  protected readonly categoryImage = categoryImage;
  protected readonly storeImage = storeImage;

  protected readonly featuredResource = rxResource({
    stream: () => this.productService.getProductsByCategory('flower'),
  });
  protected readonly featured = computed(() => (this.featuredResource.value() ?? []).slice(0, 4));
  protected readonly productTotal = signal(178);

  protected readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });
  protected readonly featuredStores = computed(() => (this.storesResource.value() ?? []).slice(0, 3));
  protected readonly storeTotal = computed(() => this.storesResource.value()?.length ?? 13);

  private readonly faqPageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('faq'),
  });
  protected readonly faqItems = computed(() => {
    const page = this.faqPageResource.value()?.[0];
    return page ? groupFaqBlocks(page.blocks).slice(0, 5) : [];
  });
  protected readonly openFaq = signal<number | null>(0);
  protected toggleFaq(i: number): void {
    this.openFaq.update((current) => (current === i ? null : i));
  }
}
