import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';
import { Reveal } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-ask-us-anything',
  imports: [ContentPageRenderer, Reveal],
  templateUrl: './ask-us-anything.html',
  styleUrl: './ask-us-anything.scss',
})
export class AskUsAnything {
  private readonly contentService = inject(ContentService);
  protected readonly pageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('faq'),
  });
  protected readonly page = computed(() => this.pageResource.value()?.[0] ?? null);
  protected readonly topics = ['Pickup & shipping', 'Products & potency', 'Medical card', 'Rewards & orders', 'Something else'];
}
