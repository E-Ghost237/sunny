import { Component, HostListener, computed, effect, inject, signal, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { ContentService } from '../../core/services/content.service';
import { MarketService, MarketRegion } from '../../core/services/market.service';
import { Logo } from '../../shared/logo/logo';
import { SmartImage } from '../../shared/smart-image/smart-image';
import { SHOP_CATEGORIES } from '../cat-bar/cat-bar';

type DropdownKey = 'shop' | 'learn' | 'account' | null;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Logo, SmartImage],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly cartService = inject(CartService);
  protected readonly authService = inject(AuthService);
  protected readonly market = inject(MarketService);
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);

  protected readonly shopCategories = SHOP_CATEGORIES;
  protected readonly openDropdown = signal<DropdownKey>(null);
  protected readonly mobileOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly cartBump = signal(false);
  protected readonly cartCount = this.cartService.totalItems;

  private readonly articlesResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
  protected readonly featuredArticles = computed(() => (this.articlesResource.value() ?? []).slice(0, 3));

  constructor() {
    // Pulse the cart icon whenever the item count goes up.
    let previous = untracked(() => this.cartService.totalItems());
    effect(() => {
      const now = this.cartService.totalItems();
      if (now > previous) {
        this.cartBump.set(true);
        setTimeout(() => this.cartBump.set(false), 650);
      }
      previous = now;
    });
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 24);
  }

  protected toggleDropdown(key: Exclude<DropdownKey, null>): void {
    this.openDropdown.update((current) => (current === key ? null : key));
  }

  protected closeDropdown(): void {
    this.openDropdown.set(null);
  }

  protected toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  protected closeMobile(): void {
    this.mobileOpen.set(false);
    this.closeDropdown();
  }

  protected onMarketChange(value: string): void {
    this.market.set(value as MarketRegion);
  }

  protected goAccount(): void {
    this.router.navigate([this.authService.isAuthenticated() ? '/account' : '/login']);
  }
}
