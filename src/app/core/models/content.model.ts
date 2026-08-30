// Real schema, informed directly by the Prismic CMS content captured in the HARs
// (sunny/har_reference/) and confirmed against the DOM-scraped fallback content --
// see sunny/extract/extract_content_blocks.py. `unknown` exists as a forward-compat
// escape hatch for future extraction passes; the current data never emits it.
export type ContentBlockType = 'heading' | 'paragraph' | 'image' | 'quote' | 'cta-banner' | 'list' | 'unknown';

export interface HeadingBlockData {
  level: number;
  text: string;
}

export interface ParagraphBlockData {
  text: string;
}

export interface ImageBlockData {
  src: string;
  alt: string;
}

export interface QuoteBlockData {
  text: string;
}

export interface CtaBannerBlockData {
  label: string;
}

export interface ListBlockData {
  ordered: boolean;
  items: string[];
}

export interface ContentBlock {
  type: ContentBlockType;
  data: HeadingBlockData | ParagraphBlockData | ImageBlockData | QuoteBlockData | CtaBannerBlockData | ListBlockData | Record<string, unknown>;
}

// learn/page have no reliable metadata beyond what's modeled here -- title/date/tags
// are best-effort (see extract_content_blocks.py), not guaranteed present.
export interface Article {
  slug: string;
  title: string;
  description: string;
  heroImage: string | null;
  tags: string[];
  publishedDate: string | null;
  blocks: ContentBlock[];
}

export interface CmsPage {
  slug: string;
  title: string;
  blocks: ContentBlock[];
}
