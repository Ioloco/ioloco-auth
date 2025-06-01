"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@Components/ShadCn/input-otp";
import { Button } from "@Components/ShadCn/button";

// @Queries
import { verifyloginMfa } from "@Queries/mfa/index";

// =================================================================================================

const MfaLoginForm = ({ temporaryToken }: { temporaryToken: string }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage("❌ Enter a valid 6-digit MFA code.");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await verifyloginMfa({
        mfaToken: otp,
        temporaryToken,
      });

      if (res.status === 200) {
        setMessage("✅ MFA verified successfully.");
      } else {
        setMessage(res.data?.message || "❌ MFA verification failed.");
      }

      window.location.href = `/admin`;
    } catch (err) {
      console.error("MFA verification error:", err);
      setMessage("❌ An error occurred during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-screen gap-6"
    >
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        name="otp"
        className="space-x-2"
      >
        <InputOTPGroup>
          {[0, 1, 2].map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="w-16 h-16 text-2xl"
            />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {[3, 4, 5].map((index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="w-16 h-16 text-2xl"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button type="submit" disabled={loading || otp.length !== 6}>
        {loading ? "Verifying..." : "Verify Code"}
      </Button>

      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </form>
  );
};

export default MfaLoginForm;
