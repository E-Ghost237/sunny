import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-medical',
  imports: [],
  templateUrl: './medical.html',
  styleUrl: './medical.scss',
})
export class Medical {
  protected readonly states = ['Illinois', 'Florida', 'Ohio', 'New York', 'Pennsylvania', 'Massachusetts'];
  protected readonly activeState = signal('Illinois');

  protected readonly steps = [
    { n: 1, title: 'Check Eligibility', body: 'Review Illinois qualifying conditions — PTSD, cancer, epilepsy, chronic pain, and 50+ others.' },
    { n: 2, title: 'Get Certified', body: 'See a licensed physician online through our trusted partners. From $22. Approved or refund.' },
    { n: 3, title: 'Apply via MCPP', body: 'Submit your application through the Illinois Medical Cannabis Patient Program portal. Digital approval only.' },
    { n: 4, title: 'Visit Sunnyside*', body: 'Show your digital card at the door. Enjoy dedicated medical lines, reserved inventory, and exclusive benefits.' },
  ];

  protected readonly partners = [
    { name: 'Leafwell', price: 'From $24 · Approved or refund', desc: 'Speak to an IL provider online in minutes.' },
    { name: 'NuggMD', price: 'From $22 · Fast & reliable', desc: 'Confidential certifications 24/7.' },
    { name: 'Veriheal', price: 'From $30 · Approved or refund', desc: 'Trusted by millions of patients nationwide.' },
  ];
}
