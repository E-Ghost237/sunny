import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Logo } from '../../shared/logo/logo';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Logo],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly year = new Date().getFullYear();
  protected readonly shopLinks = [
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
  protected readonly companyLinks = [
    { label: 'About DeLight', path: '/about' },
    { label: 'Find a location', path: '/stores' },
    { label: 'Learn', path: '/learn' },
    { label: 'Rewards', path: '/rewards' },
    { label: 'Medical program', path: '/medical' },
    { label: 'Ask us anything', path: '/askusanything' },
  ];
  protected readonly helpLinks = [
    { label: 'FAQ', path: '/faq' },
    { label: 'Shipping & pickup', path: '/page/pickup-how-it-works' },
    { label: 'Terms of service', path: '/terms' },
    { label: 'Weekly deals', path: '/page/weekly-deals' },
  ];

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
