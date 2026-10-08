import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { Article } from '../../../core/models/content.model';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';

/** Article hero: the article's own image when it exists, otherwise the Learn hero photo. */
export function articleImage(a: Article): string {
  return a.heroImage && !a.heroImage.startsWith('/assets/placeholder/') ? a.heroImage : '/assets/img/hero-learn.jpg';
}

@Component({
  selector: 'app-learn-list',
  imports: [RouterLink, SmartImage, Reveal],
  templateUrl: './learn-list.html',
  styleUrl: './learn-list.scss',
})
export class LearnList {
  private readonly contentService = inject(ContentService);

  protected readonly articlesResource = rxResource({
    stream: () => this.contentService.getArticles(),
  });
  protected readonly articles = computed(() => this.articlesResource.value() ?? []);
  protected readonly articleImage = articleImage;
  protected readonly activeTag = signal<string | null>(null);
  protected readonly tags = computed(() => [...new Set(this.articles().flatMap((a) => a.tags))]);
  protected readonly visible = computed(() => {
    const tag = this.activeTag();
    return tag ? this.articles().filter((a) => a.tags.includes(tag)) : this.articles();
  });
  /** Partner brands with a brand article, in the order they appear in the data. */
  protected readonly partnerBrands = computed(() =>
    this.articles().filter((a) => a.partnerBrand && a.partnerBrandName).map((a) => ({ slug: a.slug, name: a.partnerBrandName as string })),
  );
  protected readonly featured = computed(() => this.visible()[0] ?? null);
  protected readonly rest = computed(() => this.visible().slice(1));
}
