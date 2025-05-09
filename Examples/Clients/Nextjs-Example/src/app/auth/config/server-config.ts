// =====================
// 📁 src/auth/config/server-config.ts
// =====================
// Uri
import ServerUri from "@App/@Server/ServerUri";
import { createCookieStore } from "ioloco-auth";
import { cookies as nextCookies } from "next/headers";
import { accessTokenSchema, refreshTokenSchema } from "./schemas";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  CLIENT_REFRESH_INTERVAL,
} from "./constants";

// =====================================================================================================================

const uri = ServerUri();
export const serverAuthConfig = {
  backendUrls: {
    signinUrl: `${uri}/auth/signin`,
    refreshUrl: `${uri}/auth/refresh`,
    signoutUrl: `${uri}/auth/signout`,
    updateSessionUrl: `${uri}/auth/session/update`,
  },
  cookies: {
    getCookies: async () => createCookieStore(await nextCookies()),
    accessTokenCookieName: ACCESS_TOKEN_COOKIE,
    refreshTokenCookieName: REFRESH_TOKEN_COOKIE,
    sessionFields: {
      accessToken: accessTokenSchema,
      refreshToken: refreshTokenSchema,
    },
    exposeAccessTokenInSession: true,
  },
  clientRefresh: {
    intervalMs: CLIENT_REFRESH_INTERVAL,
  },
};
