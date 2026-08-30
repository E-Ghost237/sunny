import { Component, input, output } from '@angular/core';

// Ports sunny2's changeQty behavior into a reusable component.
@Component({
  selector: 'app-quantity-stepper',
  imports: [],
  templateUrl: './quantity-stepper.html',
  styleUrl: './quantity-stepper.scss',
})
export class QuantityStepper {
  readonly quantity = input.required<number>();
  readonly quantityChange = output<number>();

  protected decrement(): void {
    this.quantityChange.emit(this.quantity() - 1);
  }

  protected increment(): void {
    this.quantityChange.emit(this.quantity() + 1);
  }
}
