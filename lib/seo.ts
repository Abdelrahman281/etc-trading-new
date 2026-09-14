// Falls back to the live Vercel URL until the etc-trading.com.eg custom
// domain is connected and pointed at this deployment. Once it is, set
// NEXT_PUBLIC_SITE_URL in Vercel and this switches over with no code change.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://etc-trading.vercel.app';
