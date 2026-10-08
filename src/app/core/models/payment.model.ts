/** A payment method as managed in the back-office. Instructions show only when selected. */
export interface PaymentMethod {
  id: string;
  label: string;
  /** Short badge text shown on the method card at all times. */
  tags: string[];
  /** Brand accent used for the method's icon tile. */
  accent: string;
  /** Monogram shown in the icon tile. */
  mark: string;
  /** Instructions revealed only when this method is selected. */
  steps: string[];
  /** Where the customer sends funds (shown in the instructions). */
  recipient: { label: string; value: string };
  enabled: boolean;
  position: number;
}
