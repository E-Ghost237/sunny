import { Component, computed, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { of } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';
import { MAX_UPLOAD_BYTES } from '../../../core/services/upload.service';
import { ORDER_STATUS_LABEL, OrderStatus } from '../../../core/models/order.model';
import { SmartImage } from '../../../shared/smart-image/smart-image';
import { Reveal } from '../../../shared/directives/reveal.directive';

/** The steps a customer sees, in order. Rejected proof is shown as a banner, not a step. */
const TIMELINE: { status: OrderStatus; label: string }[] = [
  { status: 'awaiting-payment', label: 'Order placed' },
  { status: 'proof-submitted', label: 'Proof received' },
  { status: 'approved', label: 'Payment confirmed' },
  { status: 'dispatched', label: 'Dispatched' },
  { status: 'completed', label: 'Completed' },
];

const ALLOWED_PROOF = ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'application/pdf'];

@Component({
  selector: 'app-confirmation',
  imports: [RouterLink, CurrencyPipe, DatePipe, SmartImage, Reveal],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss',
})
export class Confirmation {
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  // Bound from the `order` query param via withComponentInputBinding().
  readonly order = input<string>();

  /** The order to show: the one in the URL, else the most recent one this browser placed. */
  private readonly orderId = computed(() => this.order() || this.orderService.myOrderIds()[0] || null);

  protected readonly orderResource = rxResource({
    params: () => this.orderId(),
    stream: ({ params }) => (params ? this.orderService.get(params) : of(null)),
  });
  protected readonly placedOrder = computed(() => this.orderResource.value() ?? null);

  private readonly methodsResource = rxResource({
    stream: () => this.paymentService.getEnabled(),
  });
  /** Instructions for the one method the customer chose. Other methods are not shown. */
  protected readonly method = computed(() => {
    const o = this.placedOrder();
    return o ? (this.methodsResource.value() ?? []).find((m) => m.id === o.payment) ?? null : null;
  });

  protected readonly timeline = TIMELINE;
  protected readonly statusLabel = ORDER_STATUS_LABEL;
  /** Whether the customer still needs to send (or resend) proof. */
  protected readonly needsProof = computed(() => {
    const s = this.placedOrder()?.status;
    return s === 'awaiting-payment' || s === 'proof-rejected';
  });
  protected readonly stepIndex = computed(() => {
    const s = this.placedOrder()?.status;
    if (!s) return -1;
    if (s === 'proof-rejected') return 0;
    if (s === 'cancelled') return -1;
    return TIMELINE.findIndex((t) => t.status === s);
  });

  protected readonly file = signal<File | null>(null);
  protected readonly uploading = signal(false);
  protected readonly uploadError = signal<string | null>(null);
  protected readonly copied = signal(false);

  protected pickFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const f = input.files?.[0] ?? null;
    this.uploadError.set(null);
    if (!f) return this.file.set(null);
    if (!ALLOWED_PROOF.includes(f.type)) {
      this.uploadError.set('Upload a screenshot or PDF of your payment receipt.');
      input.value = '';
      return this.file.set(null);
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      this.uploadError.set('That file is over 8 MB. Try a smaller screenshot.');
      input.value = '';
      return this.file.set(null);
    }
    this.file.set(f);
  }

  protected submitProof(): void {
    const o = this.placedOrder();
    const f = this.file();
    if (!o || !f || this.uploading()) return;
    this.uploading.set(true);
    this.uploadError.set(null);
    this.orderService.uploadProof(o.id, f).subscribe({
      next: (updated) => {
        this.orderResource.set(updated);
        this.file.set(null);
        this.uploading.set(false);
      },
      error: () => {
        this.uploading.set(false);
        this.uploadError.set('The upload did not go through. Please try again.');
      },
    });
  }

  protected copyRef(ref: string): void {
    navigator.clipboard?.writeText(ref).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    });
  }
}
