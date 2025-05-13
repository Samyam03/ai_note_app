'use client';
import React, { useState } from 'react';
import Sidebar from './_components/sidebar';
import Header from './_components/header';

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Blurred overlay when sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-md transition-opacity duration-300 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-full bg-blue-900 text-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[80%] max-w-xs md:w-64 md:translate-x-0 md:static md:shadow-none`}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
