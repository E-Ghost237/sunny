import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';
import { Reveal } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-cms-page',
  imports: [RouterLink, ContentPageRenderer, Reveal],
  templateUrl: './cms-page.html',
  styleUrl: './cms-page.scss',
})
export class CmsPage {
  private readonly contentService = inject(ContentService);
  readonly slug = input.required<string>();
  protected readonly pageResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.contentService.getPageBySlug(params.slug),
  });
  protected readonly page = computed(() => this.pageResource.value()?.[0] ?? null);
}
