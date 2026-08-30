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

// Ported from sunny2's global .cat-bar -- sits below the header on every page
// (confirmed via grep: it appears once in the source, before any .page div, not
// duplicated per-page), not just on shop pages.
@Component({
  selector: 'app-cat-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './cat-bar.html',
  styleUrl: './cat-bar.scss',
})
export class CatBar {
  protected readonly categories = CATEGORIES;
}
