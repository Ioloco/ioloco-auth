"use client";

import { createIolocoProvider } from "@ioloco/credentials/Client";
import { AccessToken } from "@/auth/config/schemas"; // 👈 get type here
import { clientAuthConfig } from "@/auth/config/client-config";

// =====================================================================================================================

const { Provider, useAuth } = createIolocoProvider<AccessToken>({
  config: clientAuthConfig,
  refreshIntervalMs: clientAuthConfig.clientRefresh.intervalMs,
});

export { Provider, useAuth };
