"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@Components/ShadCn/dialog";
import { Button } from "@Components/ShadCn/button";
import DeactivateMfaForm from "@/Components/Form/public/MFA/deactivateMfa.form";

// ========================================================================================================

const DeactivateMfaDialog = ({ token }: { token: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Deactivate MFA</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm MFA Deactivation</DialogTitle>
          <DialogDescription>
            Enter your current MFA token to confirm deactivation. This will
            remove extra protection from your account.
          </DialogDescription>
        </DialogHeader>

        <DeactivateMfaForm token={token} />
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateMfaDialog;
