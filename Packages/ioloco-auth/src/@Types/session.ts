// Types
import { z } from "zod";

// =====================================================================================================================

export type SessionFromSchemas<
  AccessTokenSchema extends z.ZodRawShape,
  RefreshTokenSchema extends z.ZodRawShape
> = z.infer<z.ZodObject<AccessTokenSchema>> &
  z.infer<z.ZodObject<RefreshTokenSchema>>;
