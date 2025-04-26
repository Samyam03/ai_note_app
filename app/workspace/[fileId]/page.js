'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';
import WorkspaceHeader from '../_components/workspaceHeader';
import PdfViewer from '../_components/pdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

function Workspace() {
    const { fileId } = useParams();
    const fileInfo = useQuery(api.filestorage.getFileRecord, {
        fileId: fileId
    });

    const currentFile = fileInfo?.[0];

    // Only log when fileInfo is actually available
    useEffect(() => {
        if (fileInfo) {
            console.log("fileInfo in Workspace:", fileInfo);
        }
    }, [fileInfo]); // Only runs when fileInfo changes

    return (
        <div className="flex flex-col h-screen">
      <WorkspaceHeader />
      <div className="flex flex-1">
        {/* Left side: Reserved for additional workspace UI (e.g., notes) */}
        <div className="w-1/2 border-r border-gray-200 p-4 overflow-auto">
          {/* Reserved for additional workspace UI */}
        </div>

        {/* Right side: PDF Viewer */}
        <div className="w-1/2 p-4 overflow-auto">
          {currentFile?.fileUrl && <PdfViewer fileUrl={currentFile.fileUrl} />}
        </div>
      </div>
    </div>
    )
}

export default Workspace