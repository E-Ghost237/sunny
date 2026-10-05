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

  protected readonly shopColA = [
    { label: 'Flower', slug: 'flower' },
    { label: 'Edibles', slug: 'edibles' },
    { label: 'Concentrates', slug: 'concentrates' },
    { label: 'Capsules', slug: 'capsules' },
    { label: 'Beverages', slug: 'beverages' },
  ];

  protected readonly shopColB = [
    { label: 'Vapes', slug: 'vapes' },
    { label: 'Pre-Rolls', slug: 'prerolls' },
    { label: 'Topicals', slug: 'topicals' },
    { label: 'Tinctures', slug: 'tinctures' },
    { label: 'Accessories', slug: 'accessories' },
  ];

  protected readonly companyLinks = [
    { label: 'About Us', path: '/about' },
    { label: 'Deals', path: '/shop' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Find a Dispensary', path: '/stores' },
    { label: 'News', path: '/learn' },
    { label: 'Rewards', path: '/rewards' },
    { label: 'Medical Program', path: '/medical' },
  ];

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
