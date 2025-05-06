import React, { useState, useEffect } from "react";
import Image from "next/image";
import { UserButton, SignedIn } from "@clerk/nextjs";

function WorkspaceHeader({ fileName }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm border-b border-gray-200 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Image 
            src="/logo.svg" 
            alt="Workspace Logo" 
            width={40} 
            height={40} 
            className="transition-opacity hover:opacity-80"
          />
        </div>
        <h1 className="text-lg font-semibold text-gray-800 hidden sm:block">Workspace</h1>
      </div>
      
      <div className="flex-1 mx-4">
        <h2 className="text-center text-gray-700 font-medium truncate max-w-md mx-auto">
          {fileName ? (
            <span className="text-gray-900">{fileName}.pdf</span>
          ) : (
            <span className="text-gray-400">Untitled Document</span>
          )}
        </h2>
      </div>
      
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
              />
            </div>
          </SignedIn>
        )}
      </div>
    </header>
  );
}

export default WorkspaceHeader;