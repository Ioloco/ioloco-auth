import { IolocoAuth } from "@ioloco/credentials";
import { serverAuthConfig } from "./config/server-config";

// =====================================================================================================================

export const {
  handlers: { GET, POST },
  getSafeSession,
  auth,
  refreshSession,
} = IolocoAuth(serverAuthConfig);
