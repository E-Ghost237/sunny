import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { concatMap, from, toArray } from 'rxjs';

import { PaymentService } from '../../../core/services/payment.service';
import { PaymentMethod } from '../../../core/models/payment.model';
import { errorMessage, slugify } from '../admin-shared';

interface Draft {
  id: string;
  label: string;
  tagsText: string;
  accent: string;
  mark: string;
  stepsText: string;
  recipientLabel: string;
  recipientValue: string;
  enabled: boolean;
}

const EMPTY_DRAFT: Draft = {
  id: '',
  label: '',
  tagsText: '',
  accent: '#2d6446',
  mark: '',
  stepsText: '',
  recipientLabel: 'Send to',
  recipientValue: '',
  enabled: true,
};

@Component({
  selector: 'app-admin-payments',
  imports: [FormsModule],
  templateUrl: './admin-payments.html',
})
export class AdminPayments {
  private readonly payments = inject(PaymentService);

  protected readonly res = rxResource({ stream: () => this.payments.getAll() });
  protected readonly methods = computed(() => this.res.value() ?? []);

  protected readonly message = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly busy = signal(false);

  /** Null when the editor is closed. `isNew` decides POST versus PUT. */
  protected readonly editing = signal<{ isNew: boolean; original: PaymentMethod | null } | null>(null);
  protected draft: Draft = { ...EMPTY_DRAFT };

  protected openNew(): void {
    this.draft = { ...EMPTY_DRAFT };
    this.editing.set({ isNew: true, original: null });
    this.message.set(null);
    this.error.set(null);
  }

  protected openEdit(m: PaymentMethod): void {
    this.draft = {
      id: m.id,
      label: m.label,
      tagsText: m.tags.join(', '),
      accent: m.accent,
      mark: m.mark,
      stepsText: m.steps.join('\n'),
      recipientLabel: m.recipient.label,
      recipientValue: m.recipient.value,
      enabled: m.enabled,
    };
    this.editing.set({ isNew: false, original: m });
    this.message.set(null);
    this.error.set(null);
  }

  protected closeEditor(): void {
    this.editing.set(null);
  }

  protected saveDraft(): void {
    const ed = this.editing();
    if (!ed || this.busy()) return;
    const label = this.draft.label.trim();
    if (!label) {
      this.error.set('Give the payment method a name.');
      return;
    }
    const id = ed.isNew ? slugify(label) : ed.original!.id;
    if (ed.isNew && !id) {
      this.error.set('That name does not make a usable id. Use letters or numbers.');
      return;
    }
    if (ed.isNew && this.methods().some((m) => m.id === id)) {
      this.error.set('A payment method with that name already exists.');
      return;
    }
    const position = ed.isNew ? Math.max(0, ...this.methods().map((m) => m.position)) + 1 : ed.original!.position;
    const method: PaymentMethod = {
      id,
      label,
      tags: this.lines(this.draft.tagsText, ','),
      accent: this.draft.accent || '#2d6446',
      mark: this.draft.mark.trim().slice(0, 2),
      steps: this.lines(this.draft.stepsText, '\n'),
      recipient: { label: this.draft.recipientLabel.trim() || 'Send to', value: this.draft.recipientValue.trim() },
      enabled: this.draft.enabled,
      position,
    };
    this.run(this.payments.save(method, ed.isNew), ed.isNew ? `${label} added.` : `${label} saved.`, () =>
      this.editing.set(null),
    );
  }

  protected toggle(m: PaymentMethod): void {
    this.run(this.payments.save({ ...m, enabled: !m.enabled }, false), `${m.label} ${m.enabled ? 'hidden from' : 'shown at'} checkout.`);
  }

  /** Swap positions with the neighbour above or below. */
  protected move(index: number, delta: -1 | 1): void {
    const list = this.methods();
    const other = list[index + delta];
    if (!other) return;
    const me = list[index];
    this.busy.set(true);
    from([
      { ...me, position: other.position },
      { ...other, position: me.position },
    ])
      .pipe(
        concatMap((m) => this.payments.save(m, false)),
        toArray(),
      )
      .subscribe({
        next: () => this.finish('Order updated. Checkout shows this order.'),
        error: (err) => this.fail(err, 'Could not change the order.'),
      });
  }

  protected remove(m: PaymentMethod): void {
    if (!confirm(`Remove ${m.label}? Customers will no longer see it at checkout.`)) return;
    this.busy.set(true);
    this.payments.remove(m.id).subscribe({
      next: () => this.finish(`${m.label} removed.`),
      error: (err) => this.fail(err, 'Could not remove that method.'),
    });
  }

  private run(obs: ReturnType<PaymentService['save']>, success: string, after?: () => void): void {
    this.busy.set(true);
    obs.subscribe({
      next: () => {
        after?.();
        this.finish(success);
      },
      error: (err) => this.fail(err, 'Could not save that payment method.'),
    });
  }

  private finish(message: string): void {
    this.busy.set(false);
    this.error.set(null);
    this.message.set(message);
    this.res.reload();
  }

  private fail(err: unknown, fallback: string): void {
    this.busy.set(false);
    this.error.set(errorMessage(err, fallback));
  }

  private lines(text: string, sep: string): string[] {
    return text
      .split(sep === ',' ? ',' : '\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }
}
