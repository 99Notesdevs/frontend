export const env = {
  API: process.env.NEXT_PUBLIC_API_URL || "http://auth.main.local:5000/api/v1",
  API_TEST: process.env.NEXT_PUBLIC_API_TEST_URL || "http://auth.main.local:5500/api/v1",
  API_AUTH: process.env.NEXT_PUBLIC_API_AUTH_URL || "http://auth.main.local:55000/api/v1",
  TEST_PORTAL: process.env.NEXT_PUBLIC_TEST_PORTAL_URL || "http://tests.main.local:5173",
  MAIN_PORTAL: process.env.NEXT_PUBLIC_MAIN_PORTAL_URL || "http://main.main.local:3000",
  SHOP_PORTAL: process.env.NEXT_PUBLIC_SHOP_PORTAL_URL || "http://shop.main.local:5173",
  AUTH_PORTAL: process.env.NEXT_PUBLIC_AUTH_PORTAL_URL || "http://auth.main.local:5174",
  SOCKET: process.env.NEXT_PUBLIC_SOCKET_URL || "http://auth.main.local:5000",
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "782725593034-g6v9lkkkld99ljbtma3h4bnmi8it8mmr.apps.googleusercontent.com",
};
