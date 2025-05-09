import React from "react";

import { getSafeSession } from "@App/auth";
import { RefreshSessionComponent } from "ioloco-auth/Client";

// Components
import AuthStatus from "@/app/Components/Authstatus";

// =====================================================================================================================

const Admin = async () => {
  const { session, needsRefresh, error } = await getSafeSession();

  console.log("session =====================", session);
  console.log("needsRefresh =====================", needsRefresh);
  console.log("error =====================", error);

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Session expired</h1>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (needsRefresh) {
    return <RefreshSessionComponent />;
  }

  const role = session?.lastName ?? "no role";

  if (!error && !needsRefresh) {
    return (
      <div>
        <p>Admin email : {role}</p>;
        <AuthStatus />
      </div>
    );
  }
};

export default Admin;
