import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { PaymentMethod } from '../models/payment.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/payment-methods`;

  /** Enabled methods in the order the back-office sets. */
  getEnabled(): Observable<PaymentMethod[]> {
    return this.http
      .get<PaymentMethod[]>(this.base, { params: { enabled: 'true' } })
      .pipe(map((list) => [...list].sort((a, b) => a.position - b.position)));
  }

  getAll(): Observable<PaymentMethod[]> {
    return this.http
      .get<PaymentMethod[]>(this.base)
      .pipe(map((list) => [...list].sort((a, b) => a.position - b.position)));
  }

  save(method: PaymentMethod, isNew: boolean): Observable<PaymentMethod> {
    return isNew
      ? this.http.post<PaymentMethod>(this.base, method)
      : this.http.put<PaymentMethod>(`${this.base}/${encodeURIComponent(method.id)}`, method);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${encodeURIComponent(id)}`);
  }
}
