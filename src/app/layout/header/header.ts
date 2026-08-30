import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';
import { StoreService } from '../../core/services/store.service';
import { ContentService } from '../../core/services/content.service';
import { CATEGORY_EMOJI } from '../../shared/constants/category-emoji';

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

// Sunny2's own "Collections" links mostly just go to the general shop page too --
// these aren't backed by real filterable collection data, so all point to /shop.
const COLLECTIONS = ['Summer Collection', 'High THC Collection', 'New Arrivals', 'Best for Beginners', 'Staff Picks', 'Best Sellers', 'Only At Sunnyside'];

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
  protected readonly categoryEmoji = CATEGORY_EMOJI;

  protected readonly openDropdown = signal<DropdownKey>(null);

  protected toggleDropdown(key: DropdownKey): void {
    this.openDropdown.update((current) => (current === key ? null : key));
  }

  protected closeDropdown(): void {
    this.openDropdown.set(null);
  }

  // "Current store" -- there's no real store-selection/geolocation state, so this
  // shows the first real store as a stand-in, same as sunny2's own hardcoded
  // "Buffalo Grove, IL" in its dropdown mockup.
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
      .sort((a, b) => (b.price - b.discountedPrice! - (a.price - a.discountedPrice!)))
      .slice(0, 4),
  );

  private readonly articlesResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
  protected readonly featuredArticles = computed(() => (this.articlesResource.value() ?? []).slice(0, 4));
}
