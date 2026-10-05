import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';
import { FilterSection } from '../../../core/models/category-filter.model';
import { ProductCard } from '../product-card/product-card';
import { Accordion } from '../../../shared/components/accordion/accordion';
import { RangeSlider } from '../../../shared/components/range-slider/range-slider';

// Ported from sunny2's CATEGORY_DISPLAY constant.
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

// Fallback for the 2 categories sunny2 never built a shop page for (ingestibles,
// troches) -- a minimal generic sidebar instead of no sidebar at all.
const FALLBACK_SECTIONS: FilterSection[] = [
  { title: 'Strain Type', type: 'pills', options: ['Sativa', 'Hybrid', 'Indica', 'CBD'] },
  { title: 'Price Range', type: 'range', unit: '$', unitPrefix: true, min: 0, max: 200 },
];

type WireKind = 'strain' | 'brand' | 'size' | 'featured' | 'thc-range' | 'cbd-range' | 'price-range' | null;

function wireKindFor(section: FilterSection): WireKind {
  const t = section.title.toLowerCase();
  if (section.type === 'pills' && t === 'strain type') return 'strain';
  if (section.type === 'checkboxes' && t === 'brand') return 'brand';
  if (section.type === 'checkboxes' && t === 'size') return 'size';
  if (section.type === 'checkboxes' && t === 'featured') return 'featured';
  if (section.type === 'range' && t.includes('thc')) return 'thc-range';
  if (section.type === 'range' && t.includes('cbd')) return 'cbd-range';
  if (section.type === 'range' && t === 'price range') return 'price-range';
  return null;
}

function parseThc(product: Product): number {
  if (!product.thc) return 0;
  const n = parseFloat(product.thc);
  return Number.isFinite(n) ? n : 0;
}

@Component({
  selector: 'app-category-list',
  imports: [ProductCard, RouterLink, Accordion, RangeSlider],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss',
})
export class CategoryList {
  private readonly productService = inject(ProductService);

  readonly category = input.required<ProductCategory>();

  protected readonly allCategories = ALL_CATEGORIES;
  protected readonly categoryLabel = () => CATEGORY_DISPLAY[this.category()] ?? this.category();
  protected readonly labelFor = (c: string) => CATEGORY_DISPLAY[c] ?? c;

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
  protected readonly wireKindFor = wireKindFor;

  private readonly strainSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'strain'));
  private readonly brandSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'brand'));
  private readonly sizeSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'size'));
  private readonly featuredSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'featured'));
  protected readonly thcSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'thc-range'));
  protected readonly cbdSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'cbd-range'));
  protected readonly priceSection = computed(() => this.sections().find((s) => wireKindFor(s) === 'price-range'));

  // sunny2's advertised min/max (e.g. flower "$0-$190") don't always cover every
  // real product in our sample (a few flower products are actually up to $210) --
  // widen the displayed/filterable bounds to the union of the advertised range and
  // the real data, so the slider's default (untouched) position never hides a real
  // product that simply falls outside the source's stated range.
  protected readonly effectiveThcBounds = computed(() => this.widenBounds(this.thcSection(), this.products().map(parseThc).filter((v) => v > 0)));
  protected readonly effectiveCbdBounds = computed(() =>
    this.widenBounds(this.cbdSection(), this.products().map((p) => p.cbdRaw ?? 0).filter((v) => v > 0)),
  );
  protected readonly effectivePriceBounds = computed(() => this.widenBounds(this.priceSection(), this.products().map((p) => p.price)));

  private widenBounds(section: FilterSection | undefined, values: number[]): { min: number; max: number } | null {
    if (!section) return null;
    let min = section.min!;
    let max = section.max!;
    for (const v of values) {
      if (v < min) min = Math.floor(v);
      if (v > max) max = Math.ceil(v);
    }
    return { min, max };
  }

  // Selection state -- resets per category (linkedSignal keyed on `category`), but
  // stays locally writable while the user clicks around.
  protected readonly selectedStrains = linkedSignal<ProductCategory, Set<string>>({
    source: this.category,
    computation: () => new Set<string>(),
  });
  protected readonly selectedBrands = linkedSignal<ProductCategory, Set<string>>({
    source: this.category,
    computation: () => new Set<string>(),
  });
  protected readonly selectedSizes = linkedSignal<ProductCategory, Set<string>>({
    source: this.category,
    computation: () => new Set<string>(),
  });
  protected readonly selectedFeatured = linkedSignal<ProductCategory, Set<string>>({
    source: this.category,
    computation: () => new Set<string>(),
  });
  protected readonly thcFilter = linkedSignal(() => this.effectiveThcBounds());
  protected readonly cbdFilter = linkedSignal(() => this.effectiveCbdBounds());
  protected readonly priceFilter = linkedSignal(() => this.effectivePriceBounds());

  protected toggle(set: 'strains' | 'brands' | 'sizes' | 'featured', value: string): void {
    const sig = { strains: this.selectedStrains, brands: this.selectedBrands, sizes: this.selectedSizes, featured: this.selectedFeatured }[set];
    sig.update((current) => {
      const next = new Set(current);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  }

  protected readonly filteredProducts = computed(() => {
    const strains = this.selectedStrains();
    const brands = this.selectedBrands();
    const sizes = this.selectedSizes();
    const featured = this.selectedFeatured();
    const thc = this.thcFilter();
    const cbd = this.cbdFilter();
    const price = this.priceFilter();

    return this.products().filter((p) => {
      if (strains.size > 0 && !(p.strain && strains.has(p.strain))) return false;
      if (brands.size > 0 && !(p.brand && brands.has(p.brand))) return false;
      if (sizes.size > 0 && !(p.size && sizes.has(p.size))) return false;
      if (featured.size > 0) {
        const onSale = !!p.badge;
        const onlyHere = p.isExclusive;
        const matches = [...featured].some((f) => (f.toLowerCase().includes('sale') ? onSale : onlyHere));
        if (!matches) return false;
      }
      if (thc) {
        const v = parseThc(p);
        if (v > 0 && (v < thc.min || v > thc.max)) return false;
      }
      if (cbd && p.cbdRaw != null && p.cbdRaw > 0 && (p.cbdRaw < cbd.min || p.cbdRaw > cbd.max)) return false;
      if (price && (p.price < price.min || p.price > price.max)) return false;
      return true;
    });
  });

  protected clearFilters(): void {
    this.selectedStrains.set(new Set());
    this.selectedBrands.set(new Set());
    this.selectedSizes.set(new Set());
    this.selectedFeatured.set(new Set());
    this.thcFilter.set(this.effectiveThcBounds());
    this.cbdFilter.set(this.effectiveCbdBounds());
    this.priceFilter.set(this.effectivePriceBounds());
  }

  protected readonly hasActiveFilters = computed(() => {
    const t = this.effectiveThcBounds();
    const c = this.effectiveCbdBounds();
    const pr = this.effectivePriceBounds();
    const thc = this.thcFilter();
    const cbd = this.cbdFilter();
    const price = this.priceFilter();
    return (
      this.selectedStrains().size > 0 ||
      this.selectedBrands().size > 0 ||
      this.selectedSizes().size > 0 ||
      this.selectedFeatured().size > 0 ||
      (!!t && !!thc && (thc.min !== t.min || thc.max !== t.max)) ||
      (!!c && !!cbd && (cbd.min !== c.min || cbd.max !== c.max)) ||
      (!!pr && !!price && (price.min !== pr.min || price.max !== pr.max))
    );
  });

  protected isSelected(set: 'strains' | 'brands' | 'sizes' | 'featured', value: string): boolean {
    return { strains: this.selectedStrains, brands: this.selectedBrands, sizes: this.selectedSizes, featured: this.selectedFeatured }[set]().has(value);
  }
}
