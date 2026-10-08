import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ORDER_STATUS_LABEL } from '../../core/models/order.model';
import { Reveal } from '../../shared/directives/reveal.directive';
import { SmartImage } from '../../shared/smart-image/smart-image';

@Component({
  selector: 'app-account',
  imports: [RouterLink, CurrencyPipe, DatePipe, Reveal, SmartImage],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  protected readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly ordersResource = rxResource({
    stream: () => this.orderService.mine(),
  });
  protected readonly orders = computed(() => this.ordersResource.value() ?? []);
  protected readonly statusLabel = ORDER_STATUS_LABEL;
  protected readonly totalSpent = computed(() => this.orders().reduce((sum, o) => sum + o.total, 0));
  protected readonly totalPoints = computed(() => this.orders().reduce((sum, o) => sum + o.pointsEarned, 0));

  protected signOut(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
