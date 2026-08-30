import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly year = new Date().getFullYear();

  protected readonly shopCategoriesColA = [
    { icon: '🌿', label: 'Flower', slug: 'flower' },
    { icon: '🍬', label: 'Edibles', slug: 'edibles' },
    { icon: '🔥', label: 'Concentrates', slug: 'concentrates' },
    { icon: '💊', label: 'Capsules', slug: 'capsules' },
    { icon: '🥤', label: 'Beverages', slug: 'beverages' },
  ];

  protected readonly shopCategoriesColB = [
    { icon: '💨', label: 'Vapes', slug: 'vapes' },
    { icon: '🌀', label: 'Pre-Rolls', slug: 'prerolls' },
    { icon: '🧴', label: 'Topicals', slug: 'topicals' },
    { icon: '💧', label: 'Tinctures', slug: 'tinctures' },
    { icon: '🪴', label: 'Accessories', slug: 'accessories' },
  ];

  protected scrollToTop(): void {
    window.scrollTo(0, 0);
  }
}
