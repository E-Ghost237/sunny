import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
}
