import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { AgeGate } from './layout/age-gate/age-gate';
import { CatBar } from './layout/cat-bar/cat-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Header, Footer, AgeGate, CatBar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
