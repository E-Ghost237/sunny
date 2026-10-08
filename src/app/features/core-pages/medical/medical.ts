import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { ContentService } from '../../../core/services/content.service';
import { ContentPageRenderer } from '../../../shared/content-blocks/content-page-renderer/content-page-renderer';
import { Reveal } from '../../../shared/directives/reveal.directive';

@Component({
  selector: 'app-medical',
  imports: [RouterLink, ContentPageRenderer, Reveal],
  templateUrl: './medical.html',
  styleUrl: './medical.scss',
})
export class Medical {
  private readonly contentService = inject(ContentService);

  protected readonly pageResource = rxResource({
    stream: () => this.contentService.getCorePageBySlug('medical'),
  });
  protected readonly page = computed(() => this.pageResource.value()?.[0] ?? null);

  // Medical rules differ by state. The selector only changes the explanatory copy below.
  protected readonly states = ['Illinois', 'Florida', 'Ohio', 'New York', 'Pennsylvania', 'Massachusetts'];
  protected readonly activeState = signal('Illinois');

  protected readonly steps = [
    { n: '01', title: 'Check your eligibility', body: 'Review the qualifying conditions for your state. Your clinician confirms eligibility.' },
    { n: '02', title: 'Get certified', body: 'Speak with a licensed clinician, in person or by telehealth, where your state allows it.' },
    { n: '03', title: 'Apply with your state program', body: 'Submit your application through the official state medical cannabis program.' },
    { n: '04', title: 'Shop with your card', body: 'Show your valid card and ID at a DeLight location to unlock medical purchasing.' },
  ];

  protected readonly benefits = [
    { title: 'Dedicated medical lines', body: 'Skip the queue with a line for registered patients.' },
    { title: 'Reserved inventory', body: 'Medical-only products kept on hand for registered patients.' },
    { title: 'Patient support', body: 'Staff trained to help you choose products for your needs.' },
  ];
}
