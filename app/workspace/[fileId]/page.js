'use client'
import React, { useEffect } from 'react'
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

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <WorkspaceHeader fileName={fileInfo?.fileName}/>
            
            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                
                {/* Left Panel: AI Text Editor */}
                <div className="w-1/2 border-r border-slate-200 bg-white/70 backdrop-blur-sm shadow-lg">
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">AI Study Assistant</h3>
                                    <p className="text-sm text-slate-600">Ask questions and get intelligent responses</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* Editor Content */}
                        <div className="flex-1 overflow-hidden">
                            <TextEditor fileId={fileId}/>
                        </div>
                    </div>
                </div>

                {/* Right Panel: PDF Viewer */}
                <div className="w-1/2 bg-white/70 backdrop-blur-sm shadow-lg">
                    <div className="h-full flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <BookOpen className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">Document Viewer</h3>
                                    <p className="text-sm text-slate-600">Reference your uploaded PDF</p>
                                </div>
                            </div>
                        </div>
                        
                        {/* PDF Content */}
                        <div className="flex-1 overflow-hidden">
                            {currentFile?.fileUrl ? (
                                <PdfViewer fileUrl={currentFile.fileUrl} />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                            <FileText className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Document Loading</h3>
                                            <p className="text-slate-600">Please wait while we load your PDF...</p>
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