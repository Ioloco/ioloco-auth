// =====================
// 📁 src/auth/config/schemas.ts
// =====================
import { z } from "zod";

export const accessTokenSchema = z.object({
  _id: z.string(),
  email: z.string(),
  role: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string(),
  exp: z.number(),
  iat: z.number(),
});

export const refreshTokenSchema = z.object({
  _id: z.string(),
  jti: z.string(),
  exp: z.number(),
  iat: z.number(),
});

// Optional: export inferred types
export type AccessToken = z.infer<typeof accessTokenSchema>;
export type RefreshToken = z.infer<typeof refreshTokenSchema>;
