import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-rewards',
  imports: [RouterLink],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards {
  protected readonly authService = inject(AuthService);

  protected readonly tiers = [
    { icon: '🌱', name: 'Member', desc: 'Earn on every purchase. Redeem from 40 points. Access exclusive product launches.' },
    { icon: '⭐', name: 'Plus Member', desc: 'Double-point days, early product drops, bonus point events.', highlight: true },
    { icon: '🏆', name: 'VIP', desc: 'Triple-point events, exclusive swag, VIP deals, dedicated Wellness Advisor.' },
  ];
}
