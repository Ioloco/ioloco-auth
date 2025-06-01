// HTTP
import axios, { AxiosResponse } from "axios";

// Server
import ServerUri from "@Server/ServerUri";

// ========================================================================================================

// =====================================================
//  Sign Up Credentials
// =====================================================
export const signup = async ({
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
}: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AxiosResponse> => {
  const uri = ServerUri();
  const response = await axios.post(
    `${uri}/credentials/signup`,
    { firstName, lastName, email, password, confirmPassword },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

// ========================================================================================================
// ========================================================================================================
