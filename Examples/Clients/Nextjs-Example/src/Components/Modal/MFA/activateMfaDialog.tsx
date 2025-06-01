"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@Components/ShadCn/dialog";
import { Button } from "@Components/ShadCn/button";
import VerifyMfaForm from "@/Components/Form/public/MFA/verifyMfa.form";
import { setupMfa } from "@/@Queries/mfa";

const ActivateMfaDialog = ({ token }: { token: string }) => {
  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setupMfa({ token })
        .then((res) => setQrCode(res.data.qrCode))
        .catch((err) => console.error("Failed to fetch QR Code:", err));
    } else {
      setQrCode(null);
    }
  }, [open, token]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Activate MFA</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activate MFA</DialogTitle>
          <DialogDescription>
            Scan the QR code with your authenticator app to complete setup.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex justify-center">
          {qrCode ? (
            <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
          ) : (
            <p className="text-sm text-muted-foreground">Loading QR Code...</p>
          )}
        </div>

        <VerifyMfaForm token={token} />
      </DialogContent>
    </Dialog>
  );
};

export default ActivateMfaDialog;
