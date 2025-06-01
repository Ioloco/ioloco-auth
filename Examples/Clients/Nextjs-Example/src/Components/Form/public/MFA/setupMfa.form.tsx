"use client";
import React, { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@Components/ShadCn/input-otp";

// @Queries
import { setupMfa } from "@Queries/mfa/index";

// =================================================================================================

const MfaVerifyForm = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOtpChange = async (value: string) => {
    setOtp(value);

    if (value.length === 6) {
      setLoading(true);
      setMessage(null);

      try {
        const res = await setupMfa({ token: value }); // assuming token = otp
        if (res.status === 200) {
          setMessage("✅ MFA setup successful.");
        } else {
          setMessage(res.data?.message || "❌ MFA setup failed.");
        }
      } catch (err) {
        console.error("Setup MFA failed:", err);
        setMessage("❌ An error occurred during setup.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={handleOtpChange}
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

      {loading && (
        <p className="text-muted-foreground text-sm">Setting up MFA...</p>
      )}
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
};

export default MfaVerifyForm;
