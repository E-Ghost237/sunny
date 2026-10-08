import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AdminDataService } from '../../../core/services/admin-data.service';
import { productImage } from '../../../shared/utils/media';
import { PRODUCT_CATEGORIES, errorMessage } from '../admin-shared';
import { Product, ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  imports: [RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './admin-products.html',
})
export class AdminProducts {
  private readonly data = inject(AdminDataService);

  protected readonly categories = PRODUCT_CATEGORIES;
  protected readonly image = productImage;
  protected readonly res = rxResource({ stream: () => this.data.products() });
  protected readonly all = computed(() => this.res.value() ?? []);

  protected readonly query = signal('');
  protected readonly category = signal<ProductCategory | 'all'>('all');
  protected readonly message = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const c = this.category();
    return this.all().filter(
      (p) =>
        (c === 'all' || p.category === c) &&
        (!q || p.name.toLowerCase().includes(q) || (p.brand ?? '').toLowerCase().includes(q) || p.slug.includes(q)),
    );
  });

  protected remove(p: Product): void {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    this.data.deleteProduct(String(p.id)).subscribe({
      next: () => {
        this.message.set(`Deleted ${p.name}.`);
        this.res.reload();
      },
      error: (err) => this.error.set(errorMessage(err, 'Could not delete that product.')),
    });
  }

  protected categoryLabel(value: ProductCategory): string {
    return this.categories.find((c) => c.value === value)?.label ?? value;
  }
}
