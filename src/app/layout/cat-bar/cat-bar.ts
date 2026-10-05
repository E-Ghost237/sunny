import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

const CATEGORIES = [
  { label: 'Flower', slug: 'flower' },
  { label: 'Vapes', slug: 'vapes' },
  { label: 'Edibles', slug: 'edibles' },
  { label: 'Pre-Rolls', slug: 'prerolls' },
  { label: 'Concentrates', slug: 'concentrates' },
  { label: 'Topicals', slug: 'topicals' },
  { label: 'Capsules', slug: 'capsules' },
  { label: 'Tinctures', slug: 'tinctures' },
  { label: 'Beverages', slug: 'beverages' },
  { label: 'Accessories', slug: 'accessories' },
];

/** Secondary category strip; sits under the header on every page. */
@Component({
  selector: 'app-cat-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cat-bar.html',
  styleUrl: './cat-bar.scss',
})
export class CatBar {
  protected readonly categories = CATEGORIES;
}
