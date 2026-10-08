import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { Reveal } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-rewards',
  imports: [RouterLink, Reveal],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards {
  protected readonly authService = inject(AuthService);
  protected readonly tiers = [
    { name: 'Member', kicker: 'Start earning', desc: 'Earn points on every purchase. Redeem from 40 points. Access exclusive product launches.', perks: ['1 point per $1', 'Member pricing', 'Birthday treat'] },
    { name: 'Plus', kicker: 'Most popular', desc: 'Double-point days, early product drops and bonus point events.', perks: ['2× point days', 'Early access drops', 'Free pickup priority'], highlight: true },
    { name: 'VIP', kicker: 'For regulars', desc: 'Triple-point events, exclusive gifts, VIP deals and a dedicated advisor.', perks: ['3× point events', 'Dedicated advisor', 'Exclusive gifts'] },
  ];
  protected readonly steps = [
    { n: '01', title: 'Join free', body: 'Create an account in under a minute.' },
    { n: '02', title: 'Shop & pick up', body: 'Points are added to every order.' },
    { n: '03', title: 'Redeem', body: 'Use points on your next visit.' },
  ];
}
