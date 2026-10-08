import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { AgeGate } from './layout/age-gate/age-gate';
import { CatBar } from './layout/cat-bar/cat-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AgeGate, CatBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Rotating announcement messages shown in the top ticker. */
  readonly announcements = signal<string[]>([
    'Free pickup on every online order',
    'Lab-tested batches with full COA access',
    'Eco-friendly packaging on every shipment',
    'Shipping to the US, Canada and Europe',
  ]);

  private readonly router = inject(Router);
  /** The back-office has its own shell, so storefront chrome is hidden on /admin. */
  protected readonly isAdminRoute = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects.startsWith('/admin')),
      startWith(this.router.url.startsWith('/admin')),
    ),
    { initialValue: this.router.url.startsWith('/admin') },
  );
}
