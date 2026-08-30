import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { StoreService } from '../../../core/services/store.service';
import { ContentService } from '../../../core/services/content.service';
import { ProductCard } from '../../shop/product-card/product-card';
import { ContentBlock } from '../../../core/models/content.model';

interface HeroSlide {
  title: string;
  body: string;
  primaryCta: { label: string; link: string };
  secondaryCta?: { label: string; link: string };
  background: string;
}

// Real slide copy ported from sunny2's #slide-0..3; images swapped for the real
// campaign photos the user downloaded locally (SummerStash/FlowerJar) where
// available, CSS gradients (same technique sunny2's own slide-3 uses) otherwise.
const HERO_SLIDES: HeroSlide[] = [
  {
    title: '710 deals: Up to 50% off',
    body: 'Save on Cresco, High Supply, FloraCal, Rythm & more!',
    primaryCta: { label: 'Shop Now', link: '/shop' },
    secondaryCta: { label: 'View Deals', link: '/shop' },
    background: "url('/assets/images/ag8zJ6YofJOwHggv_SUNS26020_2026_SummerStash_Launch_Rec_HPTO_Desktop_2560x936.jpg')",
  },
  {
    title: 'Your purchase limits just doubled!',
    body: 'New legislation means in-state residents and visitors can purchase more cannabis.',
    primaryCta: { label: 'Shop Now', link: '/shop' },
    secondaryCta: { label: 'Learn More', link: '/medical' },
    background: "url('/assets/images/aicdvweQX7-eW_De_CRES26005_FlowerJar_SS_IL_HPTO_Desktop_2560x936.jpg')",
  },
  {
    title: 'Your favorite flower: now in 7g',
    body: 'Get more of the same quality flower, in all the strains you love.',
    primaryCta: { label: 'Shop Now', link: '/shop/flower' },
    background: 'linear-gradient(120deg, #1a2e4a, #2e7d4f)',
  },
  {
    title: 'Get rewarded with Sunnyside Rewards.',
    body: 'Shop, collect points, unlock bigger rewards.',
    primaryCta: { label: 'Shop Now', link: '/shop' },
    secondaryCta: { label: 'Learn More', link: '/rewards' },
    background: 'linear-gradient(120deg, #154360, #2E86C1)',
  },
];

interface PromoCard {
  title: string;
  body: string;
  ctaLabel: string;
  link: string;
  image: string;
}

const PROMO_CARDS: PromoCard[] = [
  {
    title: 'The Summer Collection',
    body: 'Handpicked heat sure to turn up your summer.',
    ctaLabel: 'Shop Now',
    link: '/shop',
    image: '/assets/images/ag8pf6YofJOwHgan_SUNS26020_2026_SummerCollection_Launch_IL_WebModule_680x325.jpg',
  },
  {
    title: 'Sunnyside Celebrates Pride',
    body: "We're donating to help make a positive impact in the LGBTQ+ community.",
    ctaLabel: 'Learn More',
    link: '/learn',
    image: '/assets/images/ahnfUAeQX7-eWcVX_SUNS26002_Pride_WebModule_680x325.jpg',
  },
  {
    title: 'Say "high" to our loyalty program.',
    body: 'Join now to start earning points that you can use towards future purchases.',
    ctaLabel: 'Learn More',
    link: '/rewards',
    image: '/assets/images/Z6KsVZbqstJ9-Owr_SUNS22062_Loyalty_Web_Module_B.jpg',
  },
  {
    title: 'Want to save on taxes?',
    body: 'Pay less in taxes with a Medical Cannabis Card. Get it in 3 simple steps.',
    ctaLabel: 'Learn More',
    link: '/medical',
    image: '/assets/images/15be35dc-2b2c-4e93-a55d-811a2db23924_SUNS23066_IL_MedCard_Wed_Module_680x325.jpg',
  },
];

const INVENTORY_CATEGORIES = [
  { icon: '🌿', label: 'Flower', slug: 'flower', color: '#8DC8E8' },
  { icon: '💨', label: 'Vapes', slug: 'vapes', color: '#7BB8D8' },
  { icon: '🍊', label: 'Edibles', slug: 'edibles', color: '#8DCAE0' },
  { icon: '🌀', label: 'Pre-Rolls', slug: 'prerolls', color: '#7AB5D5' },
  { icon: '🔥', label: 'Concentrates', slug: 'concentrates', color: '#6AAAC8' },
  { icon: '🧴', label: 'Topicals', slug: 'topicals', color: '#8DC8E8' },
  { icon: '💊', label: 'Capsules', slug: 'capsules', color: '#7BB8D8' },
  { icon: '💧', label: 'Tinctures', slug: 'tinctures', color: '#8DCAE0' },
  { icon: '🥤', label: 'Beverages', slug: 'beverages', color: '#7AB5D5' },
  { icon: '🪴', label: 'Accessories', slug: 'accessories', color: '#6AAAC8' },
];

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
      current = null; // section header (h2/h3) -- not a question, stop collecting
      continue;
    }
    current?.answerBlocks.push(block);
  }
  return items;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly productService = inject(ProductService);
  private readonly storeService = inject(StoreService);
  private readonly contentService = inject(ContentService);

  protected readonly heroSlides = HERO_SLIDES;
  protected readonly activeSlide = signal(0);
  protected prevSlide(): void {
    this.activeSlide.update((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }
  protected nextSlide(): void {
    this.activeSlide.update((i) => (i + 1) % HERO_SLIDES.length);
  }

  protected readonly promoCards = PROMO_CARDS;
  protected readonly inventoryCategories = INVENTORY_CATEGORIES;

  protected readonly featuredResource = rxResource({
    stream: () => this.productService.getProductsByCategory('flower'),
  });
  protected readonly featuredTotal = computed(() => this.featuredResource.value()?.length ?? 0);

  protected readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });
  protected readonly localStore = computed(() => this.storesResource.value()?.[0] ?? null);

  private readonly faqPageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('faq'),
  });
  protected readonly faqItems = computed(() => {
    const page = this.faqPageResource.value()?.[0];
    return page ? groupFaqBlocks(page.blocks).slice(0, 6) : [];
  });
  protected readonly openFaq = signal<number | null>(0);
  protected toggleFaq(i: number): void {
    this.openFaq.update((current) => (current === i ? null : i));
  }
}
