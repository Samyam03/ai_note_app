'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton, SignedIn } from "@clerk/nextjs";

function WorkspaceHeader({ fileName }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">

        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Image 
            src="/logo.svg" 
            alt="Workspace Logo" 
            width={36} 
            height={36} 
            className="rounded-md transition-opacity hover:opacity-80"
          />
        </div>

        {/* Center: File Name */}
        <div className="flex-1 mx-4">
          <h2 className="text-center text-gray-700 font-medium truncate max-w-md mx-auto">
            {fileName ? (
              <span className="text-gray-900">{fileName}</span>
            ) : (
              <span className="text-gray-400">Untitled Document</span>
            )}
          </h2>
        </div>

        {/* Right: User Button */}
        <div className="flex-shrink-0">
          {isMounted && (
            <SignedIn>
              <div className="hover:bg-gray-100 rounded-full p-1 transition-colors">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8",
                      userButtonTrigger: "focus:shadow-none"
                    }
                  }} 
                  afterSignOutUrl="/"
                />
              </div>
            </SignedIn>
          )}
        </div>

      </div>
    </header>
  );
}

export default WorkspaceHeader;
