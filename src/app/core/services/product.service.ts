import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Product, ProductCategory } from '../models/product.model';
import { CategoryFilterDef } from '../models/category-filter.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/products`;
  private readonly filtersUrl = `${environment.apiBaseUrl}/category-filters`;

  getProductsByCategory(category: ProductCategory): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, {
      params: new HttpParams().set('category', category),
    });
  }

  getProductBySlug(category: ProductCategory, slug: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, {
      params: new HttpParams().set('category', category).set('slug', slug),
    });
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getCategoryFilters(category: ProductCategory): Observable<CategoryFilterDef[]> {
    return this.http.get<CategoryFilterDef[]>(this.filtersUrl, {
      params: new HttpParams().set('category', category),
    });
  }
}
