'use client';
import { UserButton, SignedIn } from "@clerk/nextjs";
import Image from 'next/image';
import Dialogbox from './dialogbox';
import { Button } from '@/components/ui/button';

function Header() {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">

        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Image 
            src="/logo.svg" 
            alt="logo" 
            width={36} 
            height={36} 
            className="rounded-md"
          />
        </div>

        {/* Upload Button (below md screens only) */}
        <div className="block md:hidden flex-shrink-0 ml-auto">
          <Dialogbox>
            <Button className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow transition">
              Upload PDF
            </Button>
          </Dialogbox>
        </div>

        {/* Upload + UserButton (md and up screens only) */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0 ml-auto">
          <Dialogbox>
            <Button className="bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold py-2 px-4 rounded-xl shadow transition">
              Upload PDF
            </Button>
          </Dialogbox>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

        {/* UserButton (below md screens only) */}
        <div className="block md:hidden flex-shrink-0">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>

      </div>
    </header>
  );
}

export default Header;
