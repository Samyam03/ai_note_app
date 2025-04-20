import React from 'react'
import { UserButton } from "@clerk/nextjs"

function Header() {
  return (
    <div className="flex justify-between items-center bg-white shadow-sm px-6 py-4 border-b border-gray-200">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <UserButton/>
    </div>
  )
}

export default Header