import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { AgeGate } from './layout/age-gate/age-gate';
import { CatBar } from './layout/cat-bar/cat-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Header, Footer, AgeGate, CatBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /** Site-wide announcement bar. Set to null to hide. Placeholder copy. */
  readonly announcement = signal<{ text: string; linkLabel: string; link: string } | null>({
    text: 'Free in-store pickup on every online order.',
    linkLabel: 'How pickup works',
    link: '/faq',
  });
}
