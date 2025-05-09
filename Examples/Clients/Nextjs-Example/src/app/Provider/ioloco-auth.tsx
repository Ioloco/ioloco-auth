"use client";

import { createIolocoProvider } from "ioloco-auth/Client";
import { AccessToken } from "@/app/auth/config/schemas"; // 👈 get type here
import { clientAuthConfig } from "@/app/auth/config/client-config";

// =====================================================================================================================

const { Provider, useAuth } = createIolocoProvider<AccessToken>({
  config: clientAuthConfig,
  refreshIntervalMs: clientAuthConfig.clientRefresh.intervalMs,
});

export { Provider, useAuth };
