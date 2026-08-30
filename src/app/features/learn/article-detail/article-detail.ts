import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, ContentPageRenderer],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss',
})
export class ArticleDetail {
  private readonly contentService = inject(ContentService);

  readonly slug = input.required<string>();

  protected readonly articleResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.contentService.getArticleBySlug(params.slug),
  });

  protected readonly article = computed(() => this.articleResource.value()?.[0] ?? null);
}
