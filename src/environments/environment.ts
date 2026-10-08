export const environment = {
  production: true,
  // Relative so the same build works on any host; the dev proxy / server handles /api.
  apiBaseUrl: '/api',
  // Back-office passcode. This is a client-side gate only and is visible in the bundle;
  // real admin access needs server-side authentication before going live.
  adminPasscode: 'delight-admin',
};
