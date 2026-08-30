import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Article, CmsPage } from '../models/content.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiBaseUrl}/articles`);
  }

  getArticleBySlug(slug: string): Observable<Article[]> {
    return this.http.get<Article[]>(`${environment.apiBaseUrl}/articles`, {
      params: new HttpParams().set('slug', slug),
    });
  }

  getPageBySlug(slug: string): Observable<CmsPage[]> {
    return this.http.get<CmsPage[]>(`${environment.apiBaseUrl}/pages`, {
      params: new HttpParams().set('slug', slug),
    });
  }

  getCorePageBySlug(slug: string): Observable<CmsPage[]> {
    return this.http.get<CmsPage[]>(`${environment.apiBaseUrl}/core-pages`, {
      params: new HttpParams().set('slug', slug),
    });
  }
}
