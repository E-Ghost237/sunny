import { PaymentMethodId } from '../../../core/models/order.model';

export interface PaymentMethod {
  id: PaymentMethodId;
  label: string;
  /** Short badge text shown on the method card at all times. */
  tags: string[];
  /** Brand accent used for the method's icon tile. */
  accent: string;
  /** Monogram shown in the icon tile. */
  mark: string;
  /** Instructions revealed only when this method is selected. */
  steps: string[];
  /** Where the customer sends funds (shown in the instructions). Placeholder handles. */
  recipient: { label: string; value: string };
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'zelle',
    label: 'Zelle',
    tags: ['Instant', 'Bank-to-bank'],
    accent: '#6d1ed4',
    mark: 'Z',
    steps: [
      'Open your bank app and choose Zelle.',
      'Send the total shown in your order summary to the recipient below.',
      'Put your order reference in the memo so we can match it.',
    ],
    recipient: { label: 'Send to', value: 'pay@delight.example' },
  },
  {
    id: 'cashapp',
    label: 'Cash App',
    tags: ['Instant', 'Mobile'],
    accent: '#00a86b',
    mark: '$',
    steps: [
      'Open Cash App and tap the $ icon.',
      'Send the total to the $cashtag below.',
      'Add your order reference in the note.',
    ],
    recipient: { label: '$Cashtag', value: '$DeLightShop' },
  },
  {
    id: 'chime',
    label: 'Chime',
    tags: ['Instant', 'Mobile banking'],
    accent: '#1ec677',
    mark: 'C',
    steps: [
      'Open the Chime app and select Pay or Send.',
      'Send the total to the Chime tag below.',
      'Include your order reference in the memo.',
    ],
    recipient: { label: 'Chime tag', value: '$delight' },
  },
  {
    id: 'venmo',
    label: 'Venmo',
    tags: ['Instant', 'Social pay'],
    accent: '#3d95ce',
    mark: 'V',
    steps: [
      'Open Venmo and tap Pay.',
      'Send the total to the handle below.',
      'Add your order reference in the note and keep the payment private or public, your choice.',
    ],
    recipient: { label: 'Venmo handle', value: '@DeLight-Shop' },
  },
  {
    id: 'paypal',
    label: 'PayPal',
    tags: ['Buyer protection', 'Balance or card'],
    accent: '#1f4fa3',
    mark: 'P',
    steps: [
      'Log in to PayPal and choose Send money.',
      'Send the total to the address below and select "Goods & services" if asked.',
      'Put your order reference in the note.',
    ],
    recipient: { label: 'PayPal email', value: 'pay@delight.example' },
  },
  {
    id: 'bank',
    label: 'Bank transfer',
    tags: ['1–2 business days', 'Wire or ACH'],
    accent: '#2d6446',
    mark: 'B',
    steps: [
      'Log in to your online banking and create a new transfer.',
      'Use the account details below and send the exact total.',
      'Quote your order reference in the payment description. Orders ship once funds clear.',
    ],
    recipient: { label: 'Account', value: 'DeLight Ltd · IBAN DE00 0000 0000 0000 0000 00' },
  },
  {
    id: 'applepay',
    label: 'Apple Pay',
    tags: ['One tap', 'Face ID / Touch ID'],
    accent: '#111111',
    mark: '',
    steps: [
      'Select Place order and confirm with Face ID, Touch ID or your passcode.',
      'Your order is marked paid as soon as the authorisation completes.',
      'No account numbers are shared with DeLight.',
    ],
    recipient: { label: 'Processed by', value: 'Apple Pay secure checkout' },
  },
];

export function paymentMethod(id: PaymentMethodId): PaymentMethod {
  return PAYMENT_METHODS.find((m) => m.id === id) ?? PAYMENT_METHODS[0];
}
