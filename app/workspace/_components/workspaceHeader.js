import React from "react";
import Image from "next/image";
import { UserButton, SignedIn } from "@clerk/nextjs";

function WorkspaceHeader() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
      <div className="flex items-center gap-4">
        <Image src="/logo.svg" alt="logo" width={60} height={60} />
        <h1 className="text-xl font-semibold text-gray-800">Workspace</h1>
      </div>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}

export default WorkspaceHeader;