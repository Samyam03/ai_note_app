'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import WorkspaceHeader from '../_components/workspaceHeader';
import PdfViewer from '../_components/pdfViewer';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import TextEditor from '../_components/texteditor';
import { FileText, BookOpen, Sparkles } from 'lucide-react';

function Workspace() {
    const { fileId } = useParams();
    const fileInfo = useQuery(api.filestorage.getFileRecord, {
        fileId: fileId
    });

    const currentFile = fileInfo;
    const [mobilePanel, setMobilePanel] = useState('ai'); // 'ai' or 'pdf'

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <WorkspaceHeader fileName={fileInfo?.fileName}/>
            
            {/* Mobile Toggle Buttons */}
            <div className="md:hidden flex justify-center gap-2 p-2 bg-white/80 border-b border-slate-200 z-10">
              <button
                className={`px-3 py-1 rounded font-medium text-xs border ${mobilePanel === 'ai' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-200'}`}
                onClick={() => setMobilePanel('ai')}
              >AI Study Assistant</button>
              <button
                className={`px-3 py-1 rounded font-medium text-xs border ${mobilePanel === 'pdf' ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 border-green-200'}`}
                onClick={() => setMobilePanel('pdf')}
              >Document Viewer</button>
            </div>
            
            {/* Main Content Area */}
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                
                {/* Left Panel: AI Text Editor */}
                <div className={`flex-1 h-full min-h-0 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-200 bg-white/70 backdrop-blur-sm shadow md:shadow-lg ${mobilePanel !== 'ai' ? 'hidden' : ''} md:block`}>
                    <div className="flex-1 h-full flex flex-col min-h-0">
                        {/* Panel Header */}
                        <div className="flex items-center justify-center gap-2 px-3 py-1 border-b border-slate-100 text-center">
                          <Sparkles className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-slate-700">AI Study Assistant</span>
                        </div>
                        
                        {/* Editor Content */}
                        <div className="flex-1 overflow-hidden min-h-0">
                            <TextEditor fileId={fileId}/>
                        </div>
                    </div>
                </div>

                {/* Right Panel: PDF Viewer */}
                <div className={`flex-1 h-full min-h-0 w-full md:w-1/2 bg-white/70 backdrop-blur-sm shadow md:shadow-lg ${mobilePanel !== 'pdf' ? 'hidden' : ''} md:block`}>
                    <div className="flex-1 h-full flex flex-col min-h-0">
                        {/* Panel Header */}
                        <div className="flex items-center justify-center gap-2 px-3 py-1 border-b border-slate-100 text-center">
                          <BookOpen className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-semibold text-slate-700">Document Viewer</span>
                        </div>
                        
                        {/* PDF Content */}
                        <div className="flex-1 overflow-hidden min-h-0">
                            {currentFile?.fileUrl ? (
                                <PdfViewer fileUrl={currentFile.fileUrl} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center space-y-4">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">Document Loading</h3>
                                            <p className="text-xs text-slate-600">Please wait while we load your PDF...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Workspace