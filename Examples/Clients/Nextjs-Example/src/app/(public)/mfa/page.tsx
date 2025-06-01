"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

// Form
import MfaLoginForm from "@/Components/Form/public/MFA/loginMfa.form";

// =================================================================================================

const MfaPage = () => {
  const searchParams = useSearchParams();
  const tempToken = searchParams.get("temporary_token");

  if (!tempToken) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Missing temporary token
      </div>
    );
  }

  return <MfaLoginForm temporaryToken={tempToken} />;
};

export default MfaPage;
