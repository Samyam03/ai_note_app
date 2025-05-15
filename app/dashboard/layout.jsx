'use client';
import React from 'react';
import Header from './_components/header';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Header />
      <main className="flex-1 overflow-y-auto bg-white shadow-xl rounded-t-2xl mt-3 sm:mt-4 md:mt-6 mx-2 sm:mx-4 md:mx-6 lg:mx-8 p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-200">
        {children}
      </main>
    </div>
  );
}

export default Layout;
