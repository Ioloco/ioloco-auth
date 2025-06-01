// =====================
// 📁 src/auth/config/server-config.ts
// =====================
// Uri
import ServerUri from "@/@Server/ServerUri";
import { createCookieStore } from "@ioloco/credentials";
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
    signinUrl: `${uri}/credentials/signin`,
    refreshUrl: `${uri}/credentials/refresh`,
    signoutUrl: `${uri}/credentials/signout`,
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
