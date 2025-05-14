'use client';
import { UserButton, SignedIn } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from 'next/image';

function Header({ onMenuClick }) {
  return (
    <header className="relative flex justify-between items-center bg-white px-4 md:px-6 py-4 shadow-md border-b border-gray-300">
      {/* Left Section: Menu + Logo */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
      </div>

      {/* Center Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* Right Section: User Button */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default Header;

