'use client';
import { UserButton, SignedIn } from "@clerk/nextjs";
import Image from 'next/image';
import Dialogbox from './dialogbox';
import { Button } from '@/components/ui/button';
import { Sparkles, Upload } from 'lucide-react';

function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">

        {/* Left: Logo and Brand */}
        <div className="flex items-center flex-shrink-0 space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NoteGenius
            </span>
          </div>
        </div>

        {/* UserButton (all screens) */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200"
                }
              }}
            />
          </SignedIn>
        </div>

      </div>
    </header>
  );
}

export default Header;
