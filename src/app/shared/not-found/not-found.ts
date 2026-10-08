import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Reveal } from '../directives/reveal.directive';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Reveal],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
