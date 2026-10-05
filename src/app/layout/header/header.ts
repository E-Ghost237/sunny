import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { StoreService } from '../../core/services/store.service';
import { ContentService } from '../../core/services/content.service';

type DropdownKey = 'shop' | 'deals' | 'learn' | null;

const SHOP_CATEGORIES = [
  { label: 'Flower', slug: 'flower' },
  { label: 'Vapes', slug: 'vapes' },
  { label: 'Edibles', slug: 'edibles' },
  { label: 'Pre-Rolls', slug: 'prerolls' },
  { label: 'Concentrates', slug: 'concentrates' },
  { label: 'Topicals', slug: 'topicals' },
  { label: 'Capsules', slug: 'capsules' },
  { label: 'Tinctures', slug: 'tinctures' },
  { label: 'Beverages', slug: 'beverages' },
  { label: 'Accessories', slug: 'accessories' },
];

// Merchandising collections. Not backed by real filter data yet — all route to
// /shop until collection pages land.
const COLLECTIONS = [
  'New Arrivals',
  'High THC',
  'Best for Beginners',
  'Staff Picks',
  'Best Sellers',
  'On Sale',
  'House Brand',
];

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  private readonly productService = inject(ProductService);
  private readonly storeService = inject(StoreService);
  private readonly contentService = inject(ContentService);

  protected readonly shopCategories = SHOP_CATEGORIES;
  protected readonly collections = COLLECTIONS;

  protected readonly openDropdown = signal<DropdownKey>(null);

  protected toggleDropdown(key: DropdownKey): void {
    this.openDropdown.update((current) => (current === key ? null : key));
  }

  protected closeDropdown(): void {
    this.openDropdown.set(null);
  }

  // No store-selection / geolocation state yet — show the first store as a
  // stand-in for the "shopping at" indicator.
  private readonly storesResource = rxResource({
    stream: () => this.storeService.getStores(),
  });
  protected readonly currentStore = computed(() => this.storesResource.value()?.[0] ?? null);

  private readonly productsResource = rxResource({
    stream: () => this.productService.getAllProducts(),
  });
  protected readonly dealProducts = computed(() =>
    (this.productsResource.value() ?? [])
      .filter((p) => p.badge && p.discountedPrice != null)
      .sort((a, b) => b.price - b.discountedPrice! - (a.price - a.discountedPrice!))
      .slice(0, 4),
  );

  private readonly articlesResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
  protected readonly featuredArticles = computed(() =>
    (this.articlesResource.value() ?? []).slice(0, 4),
  );
}
