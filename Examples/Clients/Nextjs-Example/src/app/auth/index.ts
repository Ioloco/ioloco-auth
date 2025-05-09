// =====================
// 📁 src/auth/auth.ts
// =====================
import { IolocoAuth } from "ioloco-auth";
import { serverAuthConfig } from "./config/server-config";

export const {
  handlers: { GET, POST },
  getSafeSession,
  auth,
  refreshSession,
} = IolocoAuth(serverAuthConfig);
