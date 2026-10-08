import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AdminDataService } from '../../../core/services/admin-data.service';
import { storeImage } from '../../../shared/utils/media';

@Component({
  selector: 'app-admin-stores',
  imports: [RouterLink, FormsModule],
  templateUrl: './admin-stores.html',
})
export class AdminStores {
  private readonly data = inject(AdminDataService);
  protected readonly res = rxResource({ stream: () => this.data.stores() });
  protected readonly all = computed(() => this.res.value() ?? []);
  protected readonly query = signal('');
  protected readonly photo = storeImage;

  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.all().filter((s) => !q || s.name.toLowerCase().includes(q) || s.address.addressLocality?.toLowerCase().includes(q) || s.address.addressRegion?.toLowerCase().includes(q));
  });
}
