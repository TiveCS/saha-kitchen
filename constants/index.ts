export const ORIGIN_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.AUTH_URL || `http://localhost:3000`;

export const TIMEZONE = "Asia/Jakarta";
