import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { CategoryFilterDef } from '../models/category-filter.model';
import { Product } from '../models/product.model';
import { StoreLocation } from '../models/store.model';

export interface Brand {
  slug: string;
  name: string;
  partner: boolean;
}

/** Read/write access for the back-office to the catalogue and stores. */
@Injectable({ providedIn: 'root' })
export class AdminDataService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiBaseUrl;

  products(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  product(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/products/${encodeURIComponent(id)}`);
  }

  saveProduct(product: Product, isNew: boolean): Observable<Product> {
    return isNew
      ? this.http.post<Product>(`${this.api}/products`, product)
      : this.http.put<Product>(`${this.api}/products/${encodeURIComponent(product.id)}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/products/${encodeURIComponent(id)}`);
  }

  stores(): Observable<StoreLocation[]> {
    return this.http.get<StoreLocation[]>(`${this.api}/stores`);
  }

  saveStore(store: StoreLocation): Observable<StoreLocation> {
    return this.http.put<StoreLocation>(`${this.api}/stores/${encodeURIComponent(store.slug)}`, store);
  }

  brands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.api}/brands`);
  }

  categoryFilters(category: string): Observable<CategoryFilterDef[]> {
    return this.http.get<CategoryFilterDef[]>(`${this.api}/category-filters`, { params: { category } });
  }
}
