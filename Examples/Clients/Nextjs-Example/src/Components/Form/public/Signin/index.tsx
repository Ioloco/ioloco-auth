"use client";

// React
import { useState } from "react";

// Next
import Link from "next/link";

// Icons
import { ArrowLeft } from "lucide-react";

// Ioloco Auth
import { signIn } from "@ioloco/credentials/Client";

// ========================================================================================================

export default function SignInForm() {
  // =====================================================
  //  State
  // =====================================================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  //  Event
  // =====================================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password }, { redirectTo: "/admin" });
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-6">
        {/* Back Button with Icon */}
        <Link
          href="/"
          className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        {/* Title */}
        <h2 className="text-3xl font-light">Sign in to your account</h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </form>
    </>
  );
}
