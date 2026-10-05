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
  /** CSS background value — gradient or `url(...) center/cover`. Placeholder art. */
  background: string;
}

// Placeholder merchandising copy — swap for the client's campaigns.
const HERO_SLIDES: HeroSlide[] = [
  {
    title: 'Weekly deals, refreshed every Monday',
    body: 'Up to 25% off select flower, vapes, and edibles across the menu.',
    primaryCta: { label: 'Shop Deals', link: '/shop' },
    secondaryCta: { label: 'How it works', link: '/page/weekly-deals' },
    background: "url('/assets/placeholder/hero.svg') center/cover",
  },
  {
    title: 'Order online, pick up in store',
    body: 'Reserve your order and skip the browse. Pay at the counter when you collect.',
    primaryCta: { label: 'Start an order', link: '/shop' },
    secondaryCta: { label: 'Pickup details', link: '/page/pickup-how-it-works' },
    background: 'linear-gradient(120deg, #1f6f3f, #124524)',
  },
  {
    title: 'New to cannabis? Start here',
    body: 'Plain-language guides to formats, dosing, and reading a label.',
    primaryCta: { label: 'Read the guides', link: '/learn' },
    background: 'linear-gradient(120deg, #2b2b27, #42423d)',
  },
  {
    title: 'Earn points on every pickup',
    body: 'Join rewards to collect points and unlock member pricing.',
    primaryCta: { label: 'Join rewards', link: '/rewards' },
    secondaryCta: { label: 'Learn more', link: '/page/summer-rewards-bonus' },
    background: 'linear-gradient(120deg, #1a5276, #2e86c1)',
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
    title: 'New arrivals',
    body: 'Fresh drops from the brands on our shelves this week.',
    ctaLabel: 'Shop new',
    link: '/shop',
    image: '/assets/placeholder/content.svg',
  },
  {
    title: 'House brand',
    body: 'Our own line — small batches, honest pricing.',
    ctaLabel: 'Explore',
    link: '/shop',
    image: '/assets/placeholder/content.svg',
  },
  {
    title: 'Rewards program',
    body: 'Points on every order, redeemable on your next visit.',
    ctaLabel: 'Learn more',
    link: '/rewards',
    image: '/assets/placeholder/content.svg',
  },
  {
    title: 'Medical program',
    body: 'Higher limits and reduced tax with a valid medical card.',
    ctaLabel: 'Learn more',
    link: '/medical',
    image: '/assets/placeholder/content.svg',
  },
];

const INVENTORY_CATEGORIES = [
  { icon: '🌿', label: 'Flower', slug: 'flower' },
  { icon: '💨', label: 'Vapes', slug: 'vapes' },
  { icon: '🍬', label: 'Edibles', slug: 'edibles' },
  { icon: '🌀', label: 'Pre-Rolls', slug: 'prerolls' },
  { icon: '🍯', label: 'Concentrates', slug: 'concentrates' },
  { icon: '🧴', label: 'Topicals', slug: 'topicals' },
  { icon: '💊', label: 'Capsules', slug: 'capsules' },
  { icon: '💧', label: 'Tinctures', slug: 'tinctures' },
  { icon: '🥤', label: 'Beverages', slug: 'beverages' },
  { icon: '🎁', label: 'Accessories', slug: 'accessories' },
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
      current = null; // section header (h2/h3) — not a question
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
