import Image from "next/image";
import Link from "next/link";

import { getSafeSession } from "@/auth";
import { RefreshSessionComponent } from "@ioloco/credentials/Client";
import ProfileMenu from "@Components/ProfileMenu";

export default async function Header() {
  const { session, needsRefresh } = await getSafeSession();

  if (needsRefresh) {
    return <RefreshSessionComponent />;
  }

  return (
    <header className="w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/ioloco-dark.svg"
              alt="Logo"
              width={50}
              height={50}
              className="rounded"
            />
          </Link>
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-4">
          <ProfileMenu
            imageUrl={session?.imageUrl}
            firstName={session?.firstName ?? ""}
            lastName={session?.lastName}
          />
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button className="md:hidden flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
