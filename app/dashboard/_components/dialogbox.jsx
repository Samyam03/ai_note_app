'use client'
import React from 'react';
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
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {useUser} from '@clerk/nextjs';
import axios from "axios";

function Dialogbox({ children }) {
  const generateUploadUrl = useMutation(api.filestorage.generateUploadUrl);
  const insertFileEntryToDB = useMutation(api.filestorage.addFileEntryToDB);
  const getFileUrl = useMutation(api.filestorage.getFileUrl);
  const embeddDocument = useAction(api.myAction.ingest);
  const [file, setFile] = useState();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const onFileSelect = (event) => {
    setFile(event.target.files[0]);
  }
  
  const onFileUpload = async () => {
    setLoading(true);
  
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
  
      console.log(response);
      
    
      const apiResponse = await axios.get('./api/pdf_loader?pdfUrl='+fileUrl);
      console.log(apiResponse.data.result);

      const embeddedResult = await embeddDocument({
        splitText: apiResponse.data.result,
        fileId: fileId,
      });
      console.log(embeddedResult);

      setLoading(false);
      alert("File uploaded successfully");
      setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setOpen(true)}
          className="cursor-pointer w-full h-9 text-sm px-4 py-1.5 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          + Upload Pdf File
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900 p-4 rounded-xl shadow-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-blue-700 ">
            Upload PDF File
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Choose a file and provide a name before uploading.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              <strong>Select Pdf</strong>
            </label>
            <input
              type="file"
              accept=".pdf"
              className="mt-1 block w-full text-sm text-gray-700
                       file:mr-2 file:py-1.5 file:px-3
                       file:rounded-md file:border-0
                       file:text-sm file:font-medium
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-500
                       hover:file:cursor-pointer"
              onChange={onFileSelect}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              <strong>File Name</strong>
            </label>
            <Input
              type="text"
              placeholder="Enter file name"
              className="mt-1 w-full h-9 text-sm cursor-text"
              onChange={(event) => setFileName(event.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="justify-start gap-2 pt-2">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="secondary" 
              className="h-9 text-sm cursor-pointer"
            >
              Close
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="h-9 text-sm px-4 py-1.5 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            onClick={onFileUpload}
            disabled={!fileName || loading}
          >
            {loading ? (
              <Loader2Icon className="animate-spin h-4 w-4" />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Dialogbox;