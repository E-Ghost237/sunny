import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { ContentBlock } from '../../../core/models/content.model';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';
import { Reveal } from '../../../shared/directives/reveal.directive';

export interface FaqGroup {
  question: string;
  answerBlocks: ContentBlock[];
}

/** Heading level 4 starts a question; everything after it (until the next heading) is the answer. */
function groupFaq(blocks: ContentBlock[]): FaqGroup[] {
  const items: FaqGroup[] = [];
  let current: FaqGroup | null = null;
  for (const block of blocks) {
    if (block.type === 'heading') {
      if ((block.data as { level: number }).level === 4) {
        current = { question: (block.data as { text: string }).text, answerBlocks: [] };
        items.push(current);
      } else {
        current = null;
      }
      continue;
    }
    current?.answerBlocks.push(block);
  }
  return items;
}

@Component({
  selector: 'app-faq',
  imports: [RouterLink, ContentPageRenderer, Reveal],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  private readonly contentService = inject(ContentService);

  protected readonly pageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('faq'),
  });
  protected readonly page = computed(() => this.pageResource.value()?.[0] ?? null);
  protected readonly groups = computed(() => (this.page() ? groupFaq(this.page()!.blocks) : []));
  protected readonly openIndex = signal<number | null>(0);

  protected toggle(i: number): void {
    this.openIndex.update((c) => (c === i ? null : i));
  }
}
