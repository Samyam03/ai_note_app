'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import React, { useState } from 'react';
import { api } from "@/convex/_generated/api";
import Image from 'next/image';
import DeleteDialogBox from './_components/deleteDialogBox';
import { FileText, Calendar, Trash2, Sparkles } from 'lucide-react';

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
    <div className="text-slate-800 p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.firstName || 'User'}! 👋
            </h2>
            <p className="text-slate-600 text-lg">
              Manage your AI-powered study notes and documents
            </p>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-500">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {isLoading ? '...' : fileList?.length || 0}
                </p>
                <p className="text-sm text-blue-700">Total Documents</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {isLoading ? '...' : fileList?.filter(f => {
                    const daysDiff = (Date.now() - f._creationTime) / (1000 * 60 * 60 * 24);
                    return daysDiff <= 7;
                  }).length || 0}
                </p>
                <p className="text-sm text-green-700">This Week</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">∞</p>
                <p className="text-sm text-purple-700">AI Notes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Files Section */}
      {(isLoading || fileList?.length > 0) ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900">Your Documents</h3>
            <p className="text-sm text-slate-500">
              {isLoading ? 'Loading...' : `${fileList?.length || 0} document${fileList?.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 items-stretch">
            {(isLoading ? skeletonArray : fileList).map((file, index) => (
              isLoading ? (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white/50 backdrop-blur-sm animate-pulse border border-slate-200 rounded-2xl shadow-sm p-5 h-full min-h-[260px]"
                >
                  <div className="w-20 h-20 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-slate-300 rounded-lg" />
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-slate-200 rounded w-1/2 mx-auto" />
                  </div>
                </div>
              ) : (
                <div
                  key={file.fileId}
                  onClick={() => {
                    setIsNavigating(true);
                    window.location.href = `/workspace/${file.fileId}`;
                  }}
                  className="relative group"
                >
                  <div className="relative flex flex-col items-center bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:scale-105 transition-all duration-300 p-5 cursor-pointer h-full min-h-[260px] hover:border-blue-200">
                    
                    {/* File Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <FileText className="w-10 h-10 text-blue-600" />
                    </div>
                    
                    {/* File Info */}
                    <div className="text-center space-y-2 w-full">
                      <h4 className="font-semibold text-slate-900 text-sm leading-tight break-words line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {file.fileName}
                      </h4>
                      {file?._creationTime && (
                        <div className="flex items-center justify-center space-x-1 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(file._creationTime)}</span>
                        </div>
                      )}
                      <div className="pt-2">
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-1.5 rounded-full w-3/4"></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Ready for AI analysis</p>
                      </div>
                    </div>

                    {/* Delete Button (top right, only on sm and up) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileId(file.fileId);
                        setShowDeleteDialog(true);
                      }}
                      className="hidden sm:block absolute top-2 right-2 z-10 p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button (bottom, only on mobile) */}
                    <div className="block sm:hidden w-full mt-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFileId(file.fileId);
                          setShowDeleteDialog(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold text-sm shadow hover:from-red-700 hover:to-red-800 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px] text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No documents yet</h3>
          <p className="text-slate-600 max-w-md">
            Upload your first PDF to start creating AI-powered study notes and get intelligent responses to your questions.
          </p>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <DeleteDialogBox
          open={showDeleteDialog}
          setOpen={setShowDeleteDialog}
          fileId={selectedFileId}
        />
      )}

      {/* Navigation Loading */}
      {isNavigating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-ping mx-auto"></div>
            </div>
            <p className="text-slate-600 font-medium">Opening your document...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
