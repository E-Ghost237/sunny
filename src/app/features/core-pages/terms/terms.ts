import { Component } from '@angular/core';

import { Reveal } from '../../../shared/directives/reveal.directive';

interface Section {
  id: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-terms',
  imports: [Reveal],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
})
export class Terms {
  protected readonly updated = 'July 2026';
  protected readonly sections: Section[] = [
    { id: 'privacy', title: 'Privacy', body: 'Our privacy policy explains what information we collect when you use this site and how we use it. By using the site, you agree to that policy.' },
    { id: 'use', title: 'Use of the site', body: 'We grant a limited, non-transferable right to access and use this site for personal, non-commercial purposes. Content may not be reproduced or redistributed for commercial purposes without permission.' },
    { id: 'restrictions', title: 'Restrictions', body: 'Automated scraping, reverse engineering or attempts to disrupt normal site operation are not permitted. Misrepresenting your identity or using the site for unlawful purposes is prohibited.' },
    { id: 'eligibility', title: 'Eligibility', body: 'This site is for adults 21 years of age or older, or 18 and over with a valid medical registration where applicable. By using the site you confirm you meet this requirement.' },
    { id: 'payment', title: 'Billing and Payment', body: 'Orders are placed online and completed with the payment method you select at checkout. Payment instructions appear for the method you choose. Pickup orders are confirmed at the location you select.' },
    { id: 'communications', title: 'Communications', body: 'If you provide an email address you may receive order messages and, unless you opt out, occasional marketing. You can unsubscribe at any time.' },
    { id: 'medical', title: 'Medical disclaimer', body: 'Nothing on this site is medical advice. Information is general and is not a substitute for guidance from a licensed physician.' },
    { id: 'liability', title: 'Limitation of liability', body: 'The site and its information are provided "as is", without warranties of any kind. To the extent permitted by law we are not liable for damages arising from use of, or inability to use, this site.' },
    { id: 'ip', title: 'Intellectual property', body: 'All text, graphics and other content on this site are owned by or licensed to DeLight and protected by applicable intellectual property laws.' },
    { id: 'law', title: 'Governing law', body: 'These terms are governed by the laws of the jurisdiction in which the operating company is registered, without regard to conflict-of-law principles.' },
    { id: 'changes', title: 'Changes to these terms', body: 'These terms may be updated from time to time. Continued use of the site after changes are posted means you accept the revised terms.' },
  ];

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
