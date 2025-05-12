// src/config/env.ts
export const env = {
  API: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  API_TEST: process.env.NEXT_PUBLIC_API_TEST_URL || "http://localhost:5500/api/v1",
  SOCKET: process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
};
