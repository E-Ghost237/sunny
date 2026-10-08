import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';
import { Reveal } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-about',
  imports: [RouterLink, ContentPageRenderer, Reveal],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly contentService = inject(ContentService);
  protected readonly pageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('about'),
  });
  protected readonly page = computed(() => this.pageResource.value()?.[0] ?? null);
}
