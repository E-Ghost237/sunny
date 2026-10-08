import { Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { articleImage } from '../../learn/learn-list/learn-list';

@Component({
  selector: 'app-article-detail',
  imports: [RouterLink, ContentPageRenderer, SmartImage, Reveal],
  templateUrl: './article-detail.html',
  styleUrl: './article-detail.scss',
})
export class ArticleDetail {
  private readonly contentService = inject(ContentService);
  readonly slug = input.required<string>();

  protected readonly articleImage = articleImage;

  protected readonly articleResource = rxResource({
    params: () => ({ slug: this.slug() }),
    stream: ({ params }) => this.contentService.getArticleBySlug(params.slug),
  });
  protected readonly article = computed(() => this.articleResource.value()?.[0] ?? null);

  private readonly allResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
  protected readonly related = computed(() =>
    (this.allResource.value() ?? []).filter((a) => a.slug !== this.slug()).slice(0, 3),
  );

  protected readonly readingDate = computed(() => {
    const d = this.article()?.publishedDate;
    return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : null;
  });
}
