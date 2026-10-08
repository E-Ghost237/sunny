import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { concatMap, from, of } from 'rxjs';

import { AdminDataService } from '../../../core/services/admin-data.service';
import { UploadService, MAX_UPLOAD_BYTES } from '../../../core/services/upload.service';
import { FilterSection } from '../../../core/models/category-filter.model';
import { Product, ProductCategory } from '../../../core/models/product.model';
import { productImage } from '../../../shared/utils/media';
import { PRODUCT_CATEGORIES, errorMessage, slugify, uniqueSuffix } from '../admin-shared';

const BLANK: Product = {
  id: 0,
  slug: '',
  name: '',
  brand: null,
  strain: null,
  strainName: null,
  strainDescription: null,
  productDescription: null,
  thc: null,
  cbd: null,
  cbn: null,
  thcRaw: null,
  thcaRaw: null,
  cbdRaw: null,
  cbdaRaw: null,
  isPctBased: null,
  size: null,
  price: 0,
  discountedPrice: null,
  badge: null,
  isExclusive: false,
  images: [],
  category: 'flower',
  filters: {},
};

const STRAINS = ['Indica', 'Sativa', 'Hybrid'];
const BADGES = ['New', 'Staff Pick', 'Sale', 'Best Seller', 'Limited Edition'];
/** Sections handled by dedicated fields above (or derived from price and potency). */
const DEDICATED = new Set(['Brand', 'Strain Type', 'Weight']);

@Component({
  selector: 'app-admin-product-form',
  imports: [FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './admin-product-form.html',
})
export class AdminProductForm {
  private readonly data = inject(AdminDataService);
  private readonly uploads = inject(UploadService);
  private readonly router = inject(Router);

  /** Bound from the :id route param. Absent on /admin/products/new. */
  readonly id = input<string>();

  protected readonly categories = PRODUCT_CATEGORIES;
  protected readonly strains = STRAINS;
  protected readonly badges = BADGES;
  protected readonly image = productImage;

  protected readonly brandsRes = rxResource({ stream: () => this.data.brands() });
  protected readonly loadRes = rxResource({
    params: () => this.id() ?? null,
    stream: ({ params }) => (params ? this.data.product(params) : of(null)),
  });

  /** Draft is edited directly through ngModel. Replaced when the product loads. */
  protected d: Product = { ...BLANK, images: [], filters: {} };
  protected readonly category = signal<ProductCategory>('flower');
  protected readonly isNew = computed(() => !this.id());

  protected readonly filterRes = rxResource({
    params: () => this.category(),
    stream: ({ params }) => this.data.categoryFilters(params),
  });
  /** Multi-value filter sections for this category (pills and checkboxes, not derived ranges). */
  protected readonly sections = computed<FilterSection[]>(() =>
    (this.filterRes.value()?.[0]?.sections ?? []).filter((s) => s.type !== 'range' && !DEDICATED.has(s.title)),
  );
  protected readonly weightOptions = computed<string[]>(
    () => (this.filterRes.value()?.[0]?.sections ?? []).find((s) => s.title === 'Weight')?.options ?? [],
  );

  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);
  protected readonly errors = signal<string[]>([]);
  protected readonly message = signal<string | null>(null);
  protected readonly loadError = signal<string | null>(null);

  constructor() {
    // When the product arrives (edit), copy it into the draft.
    effect(() => {
      const p = this.loadRes.value();
      if (!p) return;
      untracked(() => {
        this.d = { ...BLANK, ...structuredClone(p), filters: { ...(p.filters ?? {}) } };
        this.category.set(p.category);
      });
    });
    effect(() => {
      if (this.loadRes.error()) this.loadError.set('That product could not be found.');
    });
  }

  protected setCategory(value: ProductCategory): void {
    this.d.category = value;
    this.category.set(value);
  }

  protected hasFilter(title: string, value: string): boolean {
    return (this.d.filters?.[title] ?? []).includes(value);
  }

  protected toggleFilter(title: string, value: string, on: boolean): void {
    const current = this.d.filters?.[title] ?? [];
    const next = on ? [...current, value] : current.filter((v) => v !== value);
    this.d.filters = { ...(this.d.filters ?? {}), [title]: next };
  }

  // Images
  protected addFiles(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    input.value = '';
    const bad = files.find((f) => !f.type.startsWith('image/') || f.size > MAX_UPLOAD_BYTES);
    if (bad) {
      this.errors.set([`“${bad.name}” is not an image under 8 MB.`]);
      return;
    }
    if (!files.length) return;
    const name = this.d.name || 'product';
    this.uploading.set(true);
    from(files)
      .pipe(concatMap((f) => this.uploads.uploadImage('products', name, f)))
      .subscribe({
        next: (path) => (this.d.images = [...this.d.images, path]),
        error: (err) => {
          this.uploading.set(false);
          this.errors.set([errorMessage(err, 'An image did not upload. Try again.')]);
        },
        complete: () => this.uploading.set(false),
      });
  }

  protected move(index: number, delta: -1 | 1): void {
    const target = index + delta;
    if (target < 0 || target >= this.d.images.length) return;
    const next = [...this.d.images];
    [next[index], next[target]] = [next[target], next[index]];
    this.d.images = next;
  }

  protected makeMain(index: number): void {
    if (index === 0) return;
    const next = [...this.d.images];
    const [img] = next.splice(index, 1);
    next.unshift(img);
    this.d.images = next;
  }

  protected removeImage(index: number): void {
    this.d.images = this.d.images.filter((_, i) => i !== index);
  }

  // Save
  private validate(): string[] {
    const e: string[] = [];
    if (!this.d.name.trim()) e.push('Add a product name.');
    if (!this.d.category) e.push('Choose a category.');
    if (!(this.d.price > 0)) e.push('Price must be more than zero.');
    if (this.d.discountedPrice != null && this.d.discountedPrice >= this.d.price) e.push('Sale price must be lower than the regular price.');
    return e;
  }

  /** Empty text becomes null so the storefront hides blank rows. */
  private clean(p: Product): Product {
    const out: Record<string, unknown> = { ...p };
    for (const [k, v] of Object.entries(out)) {
      if (typeof v === 'string' && v.trim() === '') out[k] = null;
    }
    const filters: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(p.filters ?? {})) if (v.length) filters[k] = v;
    out['filters'] = filters;
    out['images'] = p.images;
    return out as unknown as Product;
  }

  protected save(): void {
    if (this.saving()) return;
    const e = this.validate();
    this.errors.set(e);
    this.message.set(null);
    if (e.length) return;

    const isNew = this.isNew();
    const payload = this.clean(this.d);
    if (isNew) payload.slug = `${slugify(payload.name)}-${uniqueSuffix()}`;
    this.saving.set(true);
    this.data.saveProduct(payload, isNew).subscribe({
      next: (saved) => {
        this.saving.set(false);
        if (isNew) {
          this.router.navigate(['/admin/products', saved.id], { replaceUrl: true });
          this.message.set('Product created and live on the storefront.');
        } else {
          this.d = { ...BLANK, ...structuredClone(saved), filters: { ...(saved.filters ?? {}) } };
          this.message.set('Saved. The storefront shows these changes now.');
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.errors.set([errorMessage(err, 'The product could not be saved.')]);
      },
    });
  }

  protected remove(): void {
    if (!confirm(`Delete "${this.d.name}"? This cannot be undone.`)) return;
    this.data.deleteProduct(String(this.d.id)).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (err) => this.errors.set([errorMessage(err, 'Could not delete that product.')]),
    });
  }
}
