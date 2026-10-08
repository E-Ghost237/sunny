import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';
import { SHOP_CATEGORIES } from '../../../layout/cat-bar/cat-bar';
import { StoreContext } from '../store-context/store-context';

const BLURBS: Record<string, string> = {
  flower: 'Whole-bud flower from small-batch growers, sorted by strain and potency.',
  vapes: 'Cartridges and disposables with clear extraction and ingredient details.',
  edibles: 'Gummies, chocolates and baked goods dosed per piece.',
  prerolls: 'Ready-to-enjoy joints, from classic to infused.',
  concentrates: 'Rosin, live resin and wax for experienced consumers.',
  topicals: 'Balms and lotions for targeted, non-intoxicating comfort.',
  capsules: 'Precise, measured doses in an easy-to-carry form.',
  tinctures: 'Sublingual drops with a simple, measurable dose.',
  beverages: 'Sparkling and still drinks, lightly infused.',
  accessories: 'Grinders, papers, storage and everything in between.',
};

@Component({
  selector: 'app-shop-home',
  imports: [RouterLink, SmartImage, Reveal, StoreContext],
  templateUrl: './shop-home.html',
  styleUrl: './shop-home.scss',
})
export class ShopHome {
  protected readonly categories = SHOP_CATEGORIES.map((c) => ({ ...c, blurb: BLURBS[c.slug] ?? '' }));
}
