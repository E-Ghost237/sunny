import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-shop-home',
  imports: [RouterLink],
  templateUrl: './shop-home.html',
  styleUrl: './shop-home.scss',
})
export class ShopHome {
  protected readonly categories = [
    { icon: '🌿', label: 'Flower', slug: 'flower' },
    { icon: '💨', label: 'Vapes', slug: 'vapes' },
    { icon: '🍬', label: 'Edibles', slug: 'edibles' },
    { icon: '🌀', label: 'Pre-Rolls', slug: 'prerolls' },
    { icon: '🔥', label: 'Concentrates', slug: 'concentrates' },
    { icon: '🧴', label: 'Topicals', slug: 'topicals' },
    { icon: '💊', label: 'Capsules', slug: 'capsules' },
    { icon: '💧', label: 'Tinctures', slug: 'tinctures' },
    { icon: '🥤', label: 'Beverages', slug: 'beverages' },
    { icon: '🪴', label: 'Accessories', slug: 'accessories' },
    { icon: '🍽️', label: 'Ingestibles', slug: 'ingestibles' },
    { icon: '🍫', label: 'Troches', slug: 'troches' },
  ];
}
