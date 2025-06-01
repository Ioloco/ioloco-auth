// HTTP
import axios, { AxiosResponse } from "axios";

// Server
import ServerUri from "@Server/ServerUri";

// ========================================================================================================

// =====================================================
//  MFA Setup (Generate QR Code)
// =====================================================
export const setupMfa = async ({
  token,
}: {
  token: string;
}): Promise<AxiosResponse> => {
  const uri = ServerUri();
  const response = await axios.post(
    `${uri}/mfa/setup`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );

  return response;
};

// ========================================================================================================
// ========================================================================================================

// =====================================================
//  MFA Token Verification
// =====================================================
export const verifyMfaCodeSetup = async ({
  token,
  mfaToken,
}: {
  token: string;
  mfaToken: string;
}): Promise<AxiosResponse> => {
  const uri = ServerUri();
  return await axios.post(
    `${uri}/mfa/verify-code-setup`,
    { token: mfaToken },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    }
  );
};

// ========================================================================================================
// ========================================================================================================

// =====================================================
//  MFA Token Verification
// =====================================================
export const verifyloginMfa = async ({
  mfaToken,
  temporaryToken,
}: {
  mfaToken: string;
  temporaryToken: string;
}): Promise<AxiosResponse> => {
  const uri = ServerUri();
  return await axios.post(
    `${uri}/mfa/verify-login`,
    { mfaToken, temporaryToken },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );
};

// ========================================================================================================
// ========================================================================================================

// =====================================================
//  MFA Setup (Generate QR Code)
// =====================================================
export const deactivateMfa = async ({
  token,
  code,
}: {
  token: string;
  code: string;
}): Promise<AxiosResponse> => {
  const uri = ServerUri();
  const response = await axios.post(
    `${uri}/mfa/deactivate`,
    { code },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
};

// ========================================================================================================
// ========================================================================================================

// =====================================================
//  MFA User
// =====================================================
export const getMfaUser = async ({
  token,
  userId,
}: {
  token: string;
  userId: string;
}): Promise<AxiosResponse> => {
  const uri = ServerUri();
  const response = await axios.get(`${uri}/mfa/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// ========================================================================================================
// ========================================================================================================
