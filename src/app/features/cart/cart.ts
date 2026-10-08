import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { QuantityStepper } from '../../shared/components/quantity-stepper/quantity-stepper';
import { SmartImage } from '../../shared/smart-image/smart-image';
import { Reveal } from '../../shared/directives/reveal.directive';
import { FREE_SHIPPING_OVER } from '../checkout/checkout/checkout';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, QuantityStepper, CurrencyPipe, SmartImage, Reveal],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  protected readonly cartService = inject(CartService);
  protected readonly freeShippingOver = FREE_SHIPPING_OVER;
  protected readonly toFree = computed(() => Math.max(0, FREE_SHIPPING_OVER - this.cartService.subtotal()));
  protected readonly progress = computed(() => Math.min(100, (this.cartService.subtotal() / FREE_SHIPPING_OVER) * 100));
}
