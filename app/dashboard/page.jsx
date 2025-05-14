'use client';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React from 'react';
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import Link from 'next/link';

function Page() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const fileList = useQuery(
    api.filestorage.getAllFiles,
    userEmail ? { userEmail } : undefined
  );

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isLoading = fileList === undefined;
  const skeletonArray = new Array(8).fill(0);

  return (
    <div className="text-gray-800 p-4">
      <h2 className="text-2xl font-bold mb-6 tracking-tight">Workspace</h2>

      {(isLoading || fileList?.length > 0) ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {(isLoading ? skeletonArray : fileList).map((file, index) => (
            isLoading ? (
              // Skeleton placeholder
              <div
                key={index}
                className="flex flex-col items-center bg-white/20 backdrop-blur-sm animate-pulse border border-gray-200 rounded-2xl shadow-sm p-5"
              >
                <div className="w-20 h-20 bg-white/30 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/50 rounded-xl" />
                </div>
                <span className="block h-4 bg-white/40 rounded w-24 mx-auto mt-4" />
              </div>
            ) : (
              // File card
              <Link key={file.fileId} href={`/workspace/${file.fileId}`}>
                <div
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:shadow-xl hover:scale-[1.03] transition-all duration-300 ease-in-out cursor-pointer"
                >
                  <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center">
                    <Image src="/pdf.png" alt="file" width={70} height={70} />
                  </div>
                  <p className="mt-4 text-center text-sm font-semibold text-gray-700 break-words line-clamp-2 leading-tight">
                    {file.fileName}
                  </p>
                  {file?._creationTime && (
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(file._creationTime)}
                    </p>
                  )}
                </div>
              </Link>
            )
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No files found.</p>
      )}
    </div>
  );
}

export default Page;
