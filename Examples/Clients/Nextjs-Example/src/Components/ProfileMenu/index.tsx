"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Components/ShadCn/dropdown-menu";
import { signOut } from "@ioloco/credentials/Client";

interface ProfileMenuProps {
  imageUrl?: string;
  firstName: string;
  lastName?: string;
}

export default function ProfileMenu({
  imageUrl,
  firstName,
  lastName,
}: ProfileMenuProps) {
  const getInitials = () => {
    const first = firstName?.charAt(0).toUpperCase() || "";
    const last = lastName?.charAt(0).toUpperCase() || "";
    return last ? `${first}${last}` : first;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-base font-semibold text-gray-700">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            getInitials()
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full text-left"
              onClick={() => signOut({ redirectTo: "/" })}
            >
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
