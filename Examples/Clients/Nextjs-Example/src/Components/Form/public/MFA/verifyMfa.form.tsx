// components/MFA/MfaVerificationForm.tsx
"use client";

import { useState } from "react";
import { Input } from "@Components/ShadCn/input";
import { Button } from "@Components/ShadCn/button";
import { verifyMfaCodeSetup } from "@/@Queries/mfa";

type Props = {
  token: string;
};

const VerifyMfaForm = ({ token }: Props) => {
  const [mfaToken, setMfaToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setMessage(null);

    try {
      const res = await verifyMfaCodeSetup({ token, mfaToken });

      if (res.status === 200) {
        setMessage("✅ MFA verified successfully");
      } else {
        setMessage(res.data?.message || "❌ MFA verification failed");
      }
    } catch (err) {
      console.error("MFA verify error:", err);
      setMessage("❌ An error occurred");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <form
      onSubmit={handleVerify}
      className="mt-6 flex flex-col items-center gap-4"
    >
      <Input
        type="text"
        placeholder="Enter MFA token"
        value={mfaToken}
        onChange={(e) => setMfaToken(e.target.value)}
        className="w-64 text-center"
      />
      <Button type="submit" disabled={verifying}>
        {verifying ? "Verifying..." : "Verify MFA Token"}
      </Button>
      {message && (
        <p className="text-sm text-center text-muted-foreground">{message}</p>
      )}
    </form>
  );
};

export default VerifyMfaForm;
