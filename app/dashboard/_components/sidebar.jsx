import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Layout, Shield } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import Dialogbox from './dialogbox'

function Sidebar() {
  return (
    <div className="flex flex-col justify-between shadow-2xl bg-gradient-to-b from-blue-900 to-blue-800 text-white h-screen px-6 py-8 w-64">
      <div>
        <div className="flex justify-center">
          <Image src="/logo.svg" alt="logo" width={80} height={80} />
        </div>

        <div className="mt-10 space-y-4">
        <div className="flex justify-center">
  <Dialogbox>
    <Button className="w-full bg-sky-600 hover:bg-sky-400 hover:ring-2 hover:ring-sky-200 transform hover:scale-105 transition-all duration-200 font-semibold text-white rounded-lg py-2 shadow-lg max-w-xs">
      Upload PDF
    </Button>
  </Dialogbox>
</div>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-600 transform hover:scale-115 transition-all duration-200 cursor-pointer">
            <Layout className="w-5 h-5" />
            <span className="text-sm font-medium">Workspace</span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-600 transform hover:scale-115 transition-all duration-200 cursor-pointer">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Upgrade</span>
          </div>
        </div>
      </div>

      <div className="px-2 space-y-1 mb-4">
        <Progress value={40} className="w-full bg-blue-700 h-2 rounded-full" />
        <p className="text-xs text-blue-200">2 out of 5 PDFs uploaded</p>
        <p className="text-xs text-blue-400 italic">Upgrade to upload more PDFs</p>
      </div>
    </div>
  )
}

export default Sidebar