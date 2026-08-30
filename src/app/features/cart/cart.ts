import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../core/services/cart.service';
import { QuantityStepper } from '../../shared/components/quantity-stepper/quantity-stepper';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, QuantityStepper],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  protected readonly cartService = inject(CartService);
}
