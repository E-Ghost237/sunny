import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';
import { FilterSection } from '../../../core/models/category-filter.model';
import { ProductCard } from '../product-card/product-card';
import { StoreContext } from '../store-context/store-context';
import { Accordion } from '../../../shared/components/accordion/accordion';
import { RangeSlider } from '../../../shared/components/range-slider/range-slider';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { categoryImage } from '../../../shared/utils/media';
import { Reveal } from '../../../shared/directives/reveal.directive';

// Ported from the prototype's CATEGORY_DISPLAY constant.
const CATEGORY_DISPLAY: Record<string, string> = {
  flower: 'Flower',
  vapes: 'Vapes',
  edibles: 'Edibles',
  prerolls: 'Pre-Rolls',
  concentrates: 'Concentrates',
  topicals: 'Topicals',
  capsules: 'Capsules',
  tinctures: 'Tinctures',
  beverages: 'Beverages',
  accessories: 'Accessories',
  ingestibles: 'Ingestibles',
  troches: 'Troches',
};

const ALL_CATEGORIES = Object.keys(CATEGORY_DISPLAY) as ProductCategory[];

// Fallback for the 2 categories with no filter definition (ingestibles, troches).
const FALLBACK_SECTIONS: FilterSection[] = [
  { title: 'Strain Type', type: 'pills', options: ['Sativa', 'Hybrid', 'Indica'] },
  { title: 'Price Range', type: 'range', unit: '$', unitPrefix: true, min: 0, max: 200 },
];

function parseThc(product: Product): number {
  if (!product.thc) return 0;
  const n = parseFloat(product.thc);
  return Number.isFinite(n) ? n : 0;
}

/** Product values a pills/checkbox section filters on. */
function valuesFor(product: Product, title: string): string[] {
  switch (title) {
    case 'Strain Type':
      return product.strain ? [product.strain] : [];
    case 'Brand':
      return product.brand ? [product.brand] : [];
    case 'Weight':
      return product.size ? [product.size] : [];
    default:
      return product.filters?.[title] ?? [];
  }
}

/** Numeric product value a range section filters on. */
function numberFor(product: Product, title: string): number | null {
  const t = title.toLowerCase();
  if (t.includes('thc')) return parseThc(product);
  if (t.includes('cbd')) return product.cbdRaw ?? 0;
  if (t.includes('price')) return product.price;
  return null;
}

@Component({
  selector: 'app-category-list',
  imports: [ProductCard, RouterLink, Accordion, RangeSlider, SmartImage, Reveal, StoreContext],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  private readonly productService = inject(ProductService);

  readonly category = input.required<ProductCategory>();

  protected readonly allCategories = ALL_CATEGORIES;
  protected readonly categoryLabel = () => CATEGORY_DISPLAY[this.category()] ?? this.category();
  protected readonly labelFor = (c: string) => CATEGORY_DISPLAY[c] ?? c;
  protected readonly heroImage = computed(() => categoryImage(this.category()));
  protected readonly sortMode = signal<'featured' | 'price-asc' | 'price-desc' | 'thc-desc'>('featured');
  protected readonly filtersOpen = signal(false);

  protected readonly productsResource = rxResource({
    params: () => ({ category: this.category() }),
    stream: ({ params }) => this.productService.getProductsByCategory(params.category),
  });
  protected readonly products = computed(() => this.productsResource.value() ?? []);

  private readonly filtersResource = rxResource({
    params: () => ({ category: this.category() }),
    stream: ({ params }) => this.productService.getCategoryFilters(params.category),
  });
  protected readonly sections = computed(() => this.filtersResource.value()?.[0]?.sections ?? FALLBACK_SECTIONS);

  /** Selected option values per pills/checkbox section, keyed by section title. Resets per category. */
  protected readonly selected = linkedSignal<ProductCategory, Record<string, string[]>>({
    source: this.category,
    computation: () => ({}),
  });

  /** Chosen range per range section, keyed by title. Absent means the full range (no filtering). */
  protected readonly rangeChoice = linkedSignal<ProductCategory, Record<string, { min: number; max: number }>>({
    source: this.category,
    computation: () => ({}),
  });

  /** Full bounds for a range section, widened to cover the real product data. */
  protected boundsFor(section: FilterSection): { min: number; max: number } {
    let min = section.min ?? 0;
    let max = section.max ?? 0;
    for (const p of this.products()) {
      const v = numberFor(p, section.title);
      if (v == null || v <= 0) continue;
      if (v < min) min = Math.floor(v);
      if (v > max) max = Math.ceil(v);
    }
    return { min, max };
  }

  protected isOn(title: string, value: string): boolean {
    return (this.selected()[title] ?? []).includes(value);
  }

  protected toggle(title: string, value: string): void {
    this.selected.update((current) => {
      const list = current[title] ?? [];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...current, [title]: next };
    });
  }

  protected setRange(title: string, range: { min: number; max: number }, bounds: { min: number; max: number }): void {
    this.rangeChoice.update((current) => {
      const full = range.min <= bounds.min && range.max >= bounds.max;
      const next = { ...current };
      if (full) delete next[title];
      else next[title] = range;
      return next;
    });
  }

  protected readonly filteredProducts = computed(() => {
    const selected = this.selected();
    const ranges = this.rangeChoice();
    const sections = this.sections();
    return this.products().filter((p) => {
      for (const s of sections) {
        if (s.type === 'range') {
          const r = ranges[s.title];
          const v = numberFor(p, s.title);
          if (r && v != null && (v < r.min || v > r.max)) return false;
          continue;
        }
        const wanted = selected[s.title] ?? [];
        if (wanted.length === 0) continue;
        const have = valuesFor(p, s.title);
        if (!wanted.some((w) => have.includes(w))) return false;
      }
      return true;
    });
  });

  protected readonly sortedProducts = computed(() => {
    const list = [...this.filteredProducts()];
    switch (this.sortMode()) {
      case 'price-asc':
        return list.sort((a, b) => (a.discountedPrice ?? a.price) - (b.discountedPrice ?? b.price));
      case 'price-desc':
        return list.sort((a, b) => (b.discountedPrice ?? b.price) - (a.discountedPrice ?? a.price));
      case 'thc-desc':
        return list.sort((a, b) => parseThc(b) - parseThc(a));
      default:
        return list;
    }
  });

  protected readonly hasActiveFilters = computed(
    () => Object.values(this.selected()).some((v) => v.length > 0) || Object.keys(this.rangeChoice()).length > 0,
  );

  protected clearFilters(): void {
    this.selected.set({});
    this.rangeChoice.set({});
  }
}
