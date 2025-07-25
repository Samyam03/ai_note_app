'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction, useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { Loader2Icon, Upload, FileText, X, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import axios from "axios";
import { createPortal } from 'react-dom';

function Dialogbox({ children }) {
  const generateUploadUrl = useMutation(api.filestorage.generateUploadUrl);
  const insertFileEntryToDB = useMutation(api.filestorage.addFileEntryToDB);
  const getFileUrl = useMutation(api.filestorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);

  const [file, setFile] = useState();
  const { user } = useUser();
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFileSelect = (event) => setFile(event.target.files[0]);

  const onFileUpload = async () => {
    setOpen(false);

    setTimeout(async () => {
      setLoading(true);

      try {
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
          method: "POST",
          headers: { "Content-Type": file?.type },
          body: file,
        });
        const { storageId } = await result.json();

        const fileId = uuidv4();
        const fileUrl = await getFileUrl({ storageId });

        const response = await insertFileEntryToDB({
          fileId: fileId,
          storageId: storageId,
          fileName: fileName,
          fileUrl: fileUrl,
          createdBy: user.primaryEmailAddress?.emailAddress ?? "Unknown",
        });

        const apiResponse = await axios.get(`./api/pdf_loader?pdfUrl=${fileUrl}`);

        await embeddDocument({
          splitText: apiResponse.data.result,
          fileId: fileId,
        });
      } catch (err) {
        console.error("Upload failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-white/95 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 max-w-md mx-4">
          <DialogHeader className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Upload className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  Upload PDF File
                </DialogTitle>
                <DialogDescription className="text-slate-600 mt-1">
                  Choose a file and provide a name before uploading.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* File Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Select PDF File
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={onFileSelect}
                  className="relative block w-full text-sm text-slate-700
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-gradient-to-r file:from-blue-600 file:to-indigo-600 file:text-white
                    file:hover:from-blue-700 file:hover:to-indigo-700 file:cursor-pointer
                    file:transition-all file:duration-200 file:transform file:hover:scale-105
                    file:shadow-lg file:hover:shadow-xl"
                />
                {file && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 font-medium">
                      {file.name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* File Name Section */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                File Name
              </label>
              <Input
                type="text"
                placeholder="Enter a descriptive name for your file"
                className="w-full h-11 text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors duration-200"
                onChange={(e) => setFileName(e.target.value)}
                value={fileName}
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="h-10 px-6 text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors duration-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              className="h-10 px-6 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={onFileUpload}
              disabled={!fileName || !file}
            >
              {fileName && file ? (
                <div className="flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload File</span>
                </div>
              ) : (
                <span>Upload File</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading && typeof window !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>,
        document.body
      )}
    </>
  );
}

export default Dialogbox;
