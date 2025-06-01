"use client";

// Ioloco Auth
import { useAuth } from "@/app/Provider/ioloco-auth";

export default function AuthStatus() {
  const { session, error } = useAuth();

  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  if (!session) return <p>Loading session...</p>;

  return (
    <div className="space-y-4">
      <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
        Logged in as {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
