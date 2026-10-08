import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SmartImage } from '../../shared/smart-image/smart-image';

export const SHOP_CATEGORIES = [
  { label: 'Flower', slug: 'flower', image: '/assets/img/cat-flower.jpg' },
  { label: 'Vapes', slug: 'vapes', image: '/assets/img/cat-vapes.jpg' },
  { label: 'Edibles', slug: 'edibles', image: '/assets/img/cat-edibles.jpg' },
  { label: 'Pre-Rolls', slug: 'prerolls', image: '/assets/img/cat-prerolls.jpg' },
  { label: 'Concentrates', slug: 'concentrates', image: '/assets/img/cat-concentrates.jpg' },
  { label: 'Topicals', slug: 'topicals', image: '/assets/img/cat-topicals.jpg' },
  { label: 'Capsules', slug: 'capsules', image: '/assets/img/cat-capsules.jpg' },
  { label: 'Tinctures', slug: 'tinctures', image: '/assets/img/cat-tinctures.jpg' },
  { label: 'Beverages', slug: 'beverages', image: '/assets/img/cat-beverages.jpg' },
  { label: 'Accessories', slug: 'accessories', image: '/assets/img/cat-accessories.jpg' },
];

/** Secondary category rail under the header on every page. */
@Component({
  selector: 'app-cat-bar',
  imports: [RouterLink, RouterLinkActive, SmartImage],
  templateUrl: './cat-bar.html',
  styleUrl: './cat-bar.scss',
})
export class CatBar {
  protected readonly categories = SHOP_CATEGORIES;
}
