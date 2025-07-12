'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { api } from "@/convex/_generated/api";
import { useMutation } from 'convex/react';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

function DeleteDialogBox({ open, setOpen, fileId, storageId }) {
  const deleteFileFromServer = useMutation(api.filestorage.deleteFile);
  const [isDeleting, setIsDeleting] = useState(false);

  // This function deletes the file
  const handleDeleteClick = async () => {
    setIsDeleting(true);
    try {
      await deleteFileFromServer({ fileId, storageId });
      setOpen(false); // Close the dialog after deleting
    } 
    catch (err) {
      console.error('Failed to delete:', err);
    }
     finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white/95 backdrop-blur-md text-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-200 max-w-md mx-4">
        <DialogHeader className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Delete Document
              </DialogTitle>
              <DialogDescription className="text-slate-600 mt-1">
                This action cannot be undone. The document and all associated AI notes will be permanently removed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium mb-1">Warning:</p>
                <ul className="space-y-1 text-red-600">
                  <li>• The document will be permanently deleted</li>
                  <li>• All AI-generated notes will be lost</li>
                  <li>• This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 px-6 text-sm font-medium border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors duration-200"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleDeleteClick}
            className="h-10 px-6 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Trash2 className="w-4 h-4" />
                <span>Delete Permanently</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialogBox;
