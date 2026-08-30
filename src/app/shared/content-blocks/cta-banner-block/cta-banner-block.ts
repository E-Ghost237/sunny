import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CtaBannerBlockData } from '../../../core/models/content.model';

@Component({
  selector: 'app-cta-banner-block',
  imports: [RouterLink],
  templateUrl: './cta-banner-block.html',
  styleUrl: './cta-banner-block.scss',
})
export class CtaBannerBlock {
  readonly data = input.required<CtaBannerBlockData>();
}
