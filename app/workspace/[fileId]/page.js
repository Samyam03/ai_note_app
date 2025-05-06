'use client'
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation';
import WorkspaceHeader from '../_components/workspaceHeader';
import PdfViewer from '../_components/pdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/texteditor';

function Workspace() {
    const { fileId } = useParams();
    const fileInfo = useQuery(api.filestorage.getFileRecord, {
        fileId: fileId
    });

    const currentFile = fileInfo;

    // Only log when fileInfo is actually available
    useEffect(() => {
        if (fileInfo) {
            console.log("fileInfo in Workspace:", fileInfo);
        }
    }, [fileInfo]); // Only runs when fileInfo changes

    return (
        <div className="flex flex-col h-screen">
      <WorkspaceHeader fileName={fileInfo?.fileName}/>
      <div className="flex flex-1">
        
        <div className="w-1/2 border-r border-gray-200 p-4 overflow-auto">
           <TextEditor fileId={fileId}/>
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