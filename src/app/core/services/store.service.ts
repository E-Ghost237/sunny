import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { StoreLocation } from '../models/store.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/stores`;

  getStores(): Observable<StoreLocation[]> {
    return this.http.get<StoreLocation[]>(this.baseUrl);
  }

  getStoreBySlug(slug: string): Observable<StoreLocation[]> {
    return this.http.get<StoreLocation[]>(this.baseUrl, {
      params: new HttpParams().set('slug', slug),
    });
  }
}
