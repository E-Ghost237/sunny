// `CheckEmailResponse` matches the real API contract captured in
// sunny/har_reference/auth_check_patient_email_samples.json:
// POST /auth/check-patient-email {email} -> this exact shape.
export interface CheckEmailResponse {
  success: boolean;
  can_register: boolean;
  is_registered: boolean;
  error: string | null;
}

// User/AuthState are necessarily invented -- neither the crawl nor the HARs captured
// a real registration/session response (no checkout/account traffic in the HARs).
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  rewardsPoints: number;
}

export interface AuthState {
  user: User | null;
}
