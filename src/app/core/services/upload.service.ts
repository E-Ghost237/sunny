import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, map, switchMap } from 'rxjs';

import { environment } from '../../../environments/environment';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

/** Reads a File as a base64 data URL and sends it to the API, which stores it under public/. */
@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly http = inject(HttpClient);

  readAsDataUrl(file: File): Observable<string> {
    return from(
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      }),
    );
  }

  /** Uploads a product or store photo. Returns the public path to store on the record. */
  uploadImage(folder: 'products' | 'stores', name: string, file: File): Observable<string> {
    return this.readAsDataUrl(file).pipe(
      switchMap((dataUrl) =>
        this.http.post<{ path: string }>(`${environment.apiBaseUrl}/uploads`, {
          folder,
          name,
          fileName: file.name,
          dataUrl,
        }),
      ),
      map((res) => res.path),
    );
  }
}
