import { ProductCategory } from './product.model';

// Real, per-category filter sidebar structure extracted from the prototype's 10 hand-built
// shop pages (see sunny/extract/extract_filter_sidebars.py) -- confirmed to vary
// significantly per category (flower has "Flower Type"/"Terpenes", vapes adds "CBD
// Potency"/"CBD Ratio"/"Vape Type"/"Extraction Method", etc).
export type FilterSectionType = 'pills' | 'checkboxes' | 'range';

export interface FilterSection {
  title: string;
  type: FilterSectionType;
  options?: string[];
  unit?: string;
  unitPrefix?: boolean;
  min?: number;
  max?: number;
  note?: string;
}

export interface CategoryFilterDef {
  category: ProductCategory;
  sections: FilterSection[];
}
