'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import DeleteDialogBox from './_components/deleteDialogBox';

function Page() {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const fileList = useQuery(
    api.filestorage.getAllFiles,
    userEmail ? { userEmail } : undefined
  );

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

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
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {(isLoading || fileList?.length > 0) ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 items-stretch">
          {(isLoading ? skeletonArray : fileList).map((file, index) => (
            isLoading ? (
              <div
                key={index}
                className="flex flex-col items-center bg-white/30 backdrop-blur-sm animate-pulse border border-gray-200 rounded-2xl shadow p-5 h-full min-h-[260px]"
              >
                <div className="w-20 h-20 bg-white/40 rounded-xl flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/60 rounded-xl" />
                </div>
                <span className="block h-4 bg-white/50 rounded w-24 mt-4" />
              </div>
            ) : (
              <div
                key={file.fileId}
                onClick={() => {
                  setIsNavigating(true);
                  window.location.href = `/workspace/${file.fileId}`;
                }}
                className="relative"
              >
                <div className="relative flex flex-col items-center bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition p-5 cursor-pointer h-full min-h-[260px]">
                  
                  {/* Close Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFileId(file.fileId);
                      setShowDeleteDialog(true);
                    }}
                    className="absolute top-2 right-2 z-10 p-1 rounded-full hover:ring-2 hover:ring-gray-400 transition-all duration-200 cursor-pointer"
                  >
                    <Image
                      src="/close.png"
                      alt="Delete"
                      width={20}
                      height={20}
                      className="hover:opacity-70"
                    />
                  </button>

                  <div className="w-20 h-20 bg-gray-50 border rounded-xl flex items-center justify-center">
                    <Image src="/file.png" alt="file" width={70} height={70} />
                  </div>
                  <p className="mt-4 text-center text-sm font-semibold text-gray-700 break-words line-clamp-2">
                    {file.fileName}
                  </p>
                  {file?._creationTime && (
                    <p className="mt-2 text-xs text-gray-400">
                      {formatDate(file._creationTime)}
                    </p>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
        <p className="text-xl text-gray-500 font-medium">No files found.</p>
      </div>
      
      )}

      {showDeleteDialog && (
        <DeleteDialogBox
          open={showDeleteDialog}
          setOpen={setShowDeleteDialog}
          fileId={selectedFileId}
        />
      )}

      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default Page;
