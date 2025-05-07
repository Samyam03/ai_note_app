'use client';
import React, { useState } from 'react';
import Sidebar from './_components/sidebar';
import Header from './_components/header';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Blurred overlay when sidebar is open on small screens */}
      <div
        className={`fixed inset-0 z-30 backdrop-blur-sm bg-gray-300/30 transition-opacity md:hidden ${
          isSidebarOpen ? 'block' : 'hidden'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar: 80% width on small screens, fixed 64 (16rem) on md+ */}
      <aside
        className={`fixed z-40 bg-blue-900 text-white h-full transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        w-[80%] md:w-64 md:translate-x-0 md:static md:block`}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
