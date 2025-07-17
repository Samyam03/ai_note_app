'use client';
import React, { useState, useEffect } from "react";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { Sparkles, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function WorkspaceHeader({ fileName }) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">

        {/* Left: Logo and Brand */}
        <div className="flex items-center flex-shrink-0 space-x-3">
          <button
            onClick={handleBackToDashboard}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 group -ml-20"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition-colors" />
          </button>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center ml-8">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block ml-1">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              NoteGenius
            </span>
          </div>
        </div>

        {/* Center: File Name */}
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-slate-900 font-semibold text-base truncate max-w-md">
              {fileName ? (
                <span className="text-slate-900">{fileName}</span>
              ) : (
                <span className="text-slate-400">Untitled Document</span>
              )}
            </h2>
          </div>
        </div>

        {/* UserButton (md and up screens only) */}
        <div className="hidden md:flex flex-shrink-0 ml-auto">
          {isMounted && (
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200"
                  }
                }} 
                afterSignOutUrl="/"
              />
            </SignedIn>
          )}
        </div>

        {/* UserButton (below md screens only) */}
        <div className="block md:hidden flex-shrink-0">
          {isMounted && (
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-lg border-2 border-slate-200 hover:border-blue-300 transition-colors duration-200"
                  }
                }} 
                afterSignOutUrl="/"
              />
            </SignedIn>
          )}
        </div>

      </div>
    </header>
  );
}

export default WorkspaceHeader;
