import { Component, input } from '@angular/core';

import {
  ContentBlock,
  CtaBannerBlockData,
  HeadingBlockData,
  ImageBlockData,
  ListBlockData,
  ParagraphBlockData,
  QuoteBlockData,
} from '../../../core/models/content.model';
import { HeadingBlock } from '../heading-block/heading-block';
import { ParagraphBlock } from '../paragraph-block/paragraph-block';
import { ImageBlock } from '../image-block/image-block';
import { QuoteBlock } from '../quote-block/quote-block';
import { CtaBannerBlock } from '../cta-banner-block/cta-banner-block';
import { ListBlock } from '../list-block/list-block';
import { UnknownBlock } from '../unknown-block/unknown-block';

@Component({
  selector: 'app-content-page-renderer',
  imports: [HeadingBlock, ParagraphBlock, ImageBlock, QuoteBlock, CtaBannerBlock, ListBlock, UnknownBlock],
  templateUrl: './content-page-renderer.html',
  styleUrl: './content-page-renderer.scss',
})
export class ContentPageRenderer {
  readonly blocks = input.required<ContentBlock[]>();

  protected asHeading(b: ContentBlock): HeadingBlockData {
    return b.data as HeadingBlockData;
  }
  protected asParagraph(b: ContentBlock): ParagraphBlockData {
    return b.data as ParagraphBlockData;
  }
  protected asImage(b: ContentBlock): ImageBlockData {
    return b.data as ImageBlockData;
  }
  protected asQuote(b: ContentBlock): QuoteBlockData {
    return b.data as QuoteBlockData;
  }
  protected asCta(b: ContentBlock): CtaBannerBlockData {
    return b.data as CtaBannerBlockData;
  }
  protected asList(b: ContentBlock): ListBlockData {
    return b.data as ListBlockData;
  }
  protected asUnknown(b: ContentBlock): Record<string, unknown> {
    return b.data as unknown as Record<string, unknown>;
  }
}
