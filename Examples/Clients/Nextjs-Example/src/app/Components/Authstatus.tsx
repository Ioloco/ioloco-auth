"use client";

// Ioloco Auth
import { useAuth } from "@/app/Provider/ioloco-auth";
import { signOut } from "ioloco-auth/Client";

export default function AuthStatus() {
  const { session, error } = useAuth();

  console.log("sesion", session);

  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  if (!session) return <p>Loading session...</p>;

  return (
    <div>
      <pre>Logged in as {JSON.stringify(session, null, 2)}</pre>

      <button type="button" onClick={() => signOut({ redirectTo: "/" })}>
        Signout
      </button>
      {/* <p>Role: {session}</p> */}
    </div>
  );
}
