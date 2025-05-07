import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Layout, Shield } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import Dialogbox from './dialogbox';

function Sidebar() {
  return (
    <div className="flex flex-col justify-between h-full px-4 py-6 text-white">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <Image src="/logo.svg" alt="logo" width={60} height={60} />
      </div>

      {/* Upload Button */}
      <div className="mb-6">
        <Dialogbox>
          <Button className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2 text-sm rounded-md shadow transition">
            Upload PDF
          </Button>
        </Dialogbox>
      </div>

      {/* Menu Items */}
      <nav className="space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
          <Layout className="w-5 h-5" />
          <span className="text-sm font-medium">Workspace</span>
        </div>
        <div className="flex items-center gap-3 p-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
          <Shield className="w-5 h-5" />
          <span className="text-sm font-medium">Upgrade</span>
        </div>
      </nav>

      {/* Progress */}
      <div className="mt-auto space-y-1 text-sm">
        <Progress value={40} className="w-full bg-blue-700 h-2 rounded-full" />
        <p className="text-blue-200">2 of 5 PDFs uploaded</p>
        <p className="text-blue-300 italic">Upgrade to upload more</p>
      </div>
    </div>
  );
}

export default Sidebar;
