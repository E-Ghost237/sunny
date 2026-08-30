import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';

@Component({
  selector: 'app-faq',
  imports: [ContentPageRenderer],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly contentService = inject(ContentService);

  protected readonly pageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('faq'),
  });

  protected readonly page = computed(() => this.pageResource.value()?.[0] ?? null);
}
