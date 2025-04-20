import React from 'react'
import Sidebar from './_components/sidebar'
import Header from './_components/header'

function Layout({ children }) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-blue-900 text-white fixed h-full shadow-lg z-10">
        <Sidebar />
      </aside>
      
      <main className="md:ml-64 flex-1 bg-gray-100 overflow-auto p-6">
        <Header />
        {children}
      </main>
    </div>
  )
}

export default Layout