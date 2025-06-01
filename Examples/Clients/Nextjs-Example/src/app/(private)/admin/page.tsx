import React from "react";

import { getSafeSession } from "@/auth";
import { RefreshSessionComponent } from "@ioloco/credentials/Client";

// Components
import AuthStatus from "@Components/Authstatus";
import ActivateMfaDialog from "@Components/Modal/MFA/activateMfaDialog"; // ✅ Add this
import DeactivateMfaDialog from "@Components/Modal/MFA/deactivateMfaDialog"; // ✅ Add this

// ShadCN UI
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@Components/ShadCn/tabs";
import { Button } from "@Components/ShadCn/button";

// @Queries
import { getMfaUser } from "@Queries/mfa";

// =====================================================================================================================

const Admin = async () => {
  const { session, needsRefresh, error } = await getSafeSession();

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold">Session expired</h1>
        <p className="text-gray-600">{error.message}</p>
        <Button className="mt-4">Try Again</Button>
      </div>
    );
  }

  if (needsRefresh) {
    return <RefreshSessionComponent />;
  }

  // ==============================
  //  MFA Data
  // ==============================
  const token = session!.token!;
  const userId = session!._id!;
  const { data } = await getMfaUser({ token, userId });

  if (!error && !needsRefresh) {
    return (
      <div className="p-6">
        <Tabs defaultValue="status" className="w-full max-w-xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="status">Session Info</TabsTrigger>
            <TabsTrigger value="tools">Multi-Factor Authentication</TabsTrigger>
          </TabsList>

          <TabsContent value="status">
            <div className="mt-4 space-y-4">
              <AuthStatus />
            </div>
          </TabsContent>

          <TabsContent value="tools">
            <div className="mt-4 flex justify-center">
              {data?.data?.mfa?.enabled ? (
                <DeactivateMfaDialog token={session!.token!} />
              ) : (
                <ActivateMfaDialog token={session!.token!} />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return null;
};

export default Admin;
