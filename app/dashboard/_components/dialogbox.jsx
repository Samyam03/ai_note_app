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

function Dialogbox({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white text-gray-900 p-4 rounded-xl shadow-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold text-blue-700">
            Upload PDF File
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Choose a file and provide a name before uploading.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select PDF
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
                         cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              File Name *
            </label>
            <Input
              type="text"
              placeholder="Enter file name"
              className="mt-1 w-full h-9 text-sm"
            />
          </div>
        </div>

        <DialogFooter className="justify-start gap-2 pt-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="h-9 text-sm">
              Close
            </Button>
          </DialogClose>
          <button
            type="button"
            className="h-9 text-sm px-4 py-1.5 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-500"
          >
            Upload
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Dialogbox;