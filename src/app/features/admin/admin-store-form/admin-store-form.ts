import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

import { AdminDataService } from '../../../core/services/admin-data.service';
import { UploadService, MAX_UPLOAD_BYTES } from '../../../core/services/upload.service';
import { StoreHours, StoreLocation } from '../../../core/models/store.model';
import { STORE_DAYS, errorMessage } from '../admin-shared';
import { STORE_VIEWS, StoreView, storeImage } from '../../../shared/utils/media';

interface HoursRow {
  day: string;
  open: boolean;
  opens: string;
  closes: string;
}

@Component({
  selector: 'app-admin-store-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-store-form.html',
})
export class AdminStoreForm {
  private readonly data = inject(AdminDataService);
  private readonly uploads = inject(UploadService);

  /** Bound from the :slug route param. */
  readonly slug = input<string>();

  protected readonly views = STORE_VIEWS;
  protected readonly photo = storeImage;
  protected readonly brandsRes = rxResource({ stream: () => this.data.brands() });
  protected readonly loadRes = rxResource({
    params: () => this.slug() ?? null,
    stream: () => this.data.stores(),
  });

  protected store: StoreLocation | null = null;
  protected hours: HoursRow[] = [];
  protected readonly ready = signal(false);
  protected readonly saving = signal(false);
  protected readonly uploadingView = signal<StoreView | null>(null);
  protected readonly errors = signal<string[]>([]);
  protected readonly message = signal<string | null>(null);
  protected readonly missing = signal(false);

  /** Form fields are bound to these plain properties through ngModel. */
  protected f = {
    name: '',
    phone: '',
    street: '',
    locality: '',
    region: '',
    postal: '',
    country: 'US',
    lat: null as number | null,
    lng: null as number | null,
    timezone: '',
    description: '',
    recPickup: false,
    recDelivery: false,
    medPickup: false,
    medDelivery: false,
    recComingSoon: false,
    medComingSoon: false,
    brands: [] as string[],
  };

  constructor() {
    effect(() => {
      const list = this.loadRes.value();
      const slug = this.slug();
      if (!list || !slug) return;
      const s = list.find((x) => x.slug === slug) ?? null;
      untracked(() => {
        this.missing.set(!s);
        this.load(s);
      });
    });
  }

  private load(s: StoreLocation | null): void {
    this.store = s ? structuredClone(s) : null;
    if (!s) {
      this.ready.set(false);
      return;
    }
    this.f = {
      name: s.name,
      phone: s.phone ?? '',
      street: s.address.streetAddress ?? '',
      locality: s.address.addressLocality ?? '',
      region: s.address.addressRegion ?? '',
      postal: s.address.postalCode ?? '',
      country: s.address.addressCountry ?? 'US',
      lat: s.lat,
      lng: s.lng,
      timezone: s.timezone ?? '',
      description: s.description ?? '',
      recPickup: s.capabilities.recPickup,
      recDelivery: s.capabilities.recDelivery,
      medPickup: s.capabilities.medPickup,
      medDelivery: s.capabilities.medDelivery,
      recComingSoon: s.capabilities.recComingSoon,
      medComingSoon: s.capabilities.medComingSoon,
      brands: [...s.brands],
    };
    this.hours = STORE_DAYS.map((day) => {
      const h = s.openingHours.find((x) => x.day === day);
      return { day, open: !!h?.opens, opens: h?.opens ?? '09:00', closes: h?.closes ?? '21:00' };
    });
    this.ready.set(true);
  }

  protected hasBrand(name: string): boolean {
    return this.f.brands.includes(name);
  }

  protected toggleBrand(name: string, on: boolean): void {
    this.f.brands = on ? [...this.f.brands, name] : this.f.brands.filter((b) => b !== name);
  }

  protected photoFor(view: StoreView): string {
    return this.store ? this.photo(this.store, view) : '';
  }

  protected uploadPhoto(view: StoreView, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !this.store) return;
    if (!file.type.startsWith('image/') || file.size > MAX_UPLOAD_BYTES) {
      this.errors.set(['Photos must be images under 8 MB.']);
      return;
    }
    this.uploadingView.set(view);
    this.uploads.uploadImage('stores', `${this.store.slug}-${view}`, file).subscribe({
      next: (path) => {
        this.store = { ...this.store!, photos: { ...(this.store!.photos ?? {}), [view]: path } };
        this.uploadingView.set(null);
        this.message.set('Photo uploaded. Save to publish it.');
      },
      error: (err) => {
        this.uploadingView.set(null);
        this.errors.set([errorMessage(err, 'That photo did not upload.')]);
      },
    });
  }

  protected resetPhoto(view: StoreView): void {
    if (!this.store?.photos) return;
    const photos = { ...this.store.photos };
    delete photos[view];
    this.store = { ...this.store, photos };
  }

  protected save(): void {
    if (!this.store || this.saving()) return;
    const errs: string[] = [];
    if (!this.f.name.trim()) errs.push('Add a store name.');
    if (!this.f.street.trim() || !this.f.locality.trim()) errs.push('Add the street address and city.');
    this.errors.set(errs);
    this.message.set(null);
    if (errs.length) return;

    const openingHours: StoreHours[] = this.hours.map((h) => ({
      day: h.day,
      opens: h.open ? h.opens : null,
      closes: h.open ? h.closes : null,
    }));
    const next: StoreLocation = {
      ...this.store,
      name: this.f.name.trim(),
      phone: this.f.phone.trim() || null,
      address: {
        streetAddress: this.f.street.trim(),
        addressLocality: this.f.locality.trim(),
        addressRegion: this.f.region.trim() || null,
        postalCode: this.f.postal.trim() || null,
        addressCountry: this.f.country.trim() || null,
      },
      lat: this.f.lat,
      lng: this.f.lng,
      timezone: this.f.timezone.trim() || null,
      description: this.f.description.trim(),
      brands: this.f.brands,
      capabilities: {
        recPickup: this.f.recPickup,
        recDelivery: this.f.recDelivery,
        medPickup: this.f.medPickup,
        medDelivery: this.f.medDelivery,
        recComingSoon: this.f.recComingSoon,
        medComingSoon: this.f.medComingSoon,
      },
      openingHours,
    };
    this.saving.set(true);
    this.data.saveStore(next).subscribe({
      next: (saved) => {
        this.saving.set(false);
        this.load(saved);
        this.message.set('Store saved. The storefront shows these details now.');
        this.loadRes.reload();
      },
      error: (err) => {
        this.saving.set(false);
        this.errors.set([errorMessage(err, 'The store could not be saved.')]);
      },
    });
  }
}
