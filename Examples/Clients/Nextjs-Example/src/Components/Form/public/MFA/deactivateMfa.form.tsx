"use client";

import { useState } from "react";
import { Input } from "@Components/ShadCn/input";
import { Button } from "@Components/ShadCn/button";
import { deactivateMfa } from "@/@Queries/mfa";

// ========================================================================================================

const DeactivateMfaForm = ({ token }: { token: string }) => {
  const [mfaToken, setMfaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleDeactivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await deactivateMfa({ token, code: mfaToken });

      if (res.status === 200) {
        setMessage("✅ MFA deactivated successfully");
      } else {
        setMessage(res.data?.message || "❌ MFA deactivation failed");
      }
    } catch (err) {
      console.error("MFA deactivation error:", err);
      setMessage("❌ An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleDeactivate}
      className="mt-6 flex flex-col items-center gap-4"
    >
      <Input
        type="text"
        placeholder="Enter MFA token to deactivate"
        value={mfaToken}
        onChange={(e) => setMfaToken(e.target.value)}
        className="w-64 text-center"
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? "Submitting..." : "Deactivate MFA"}
      </Button>
      {message && (
        <p className="text-sm text-center text-muted-foreground">{message}</p>
      )}
    </form>
  );
};

export default DeactivateMfaForm;
