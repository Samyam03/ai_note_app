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
      <DialogContent className="bg-white text-gray-900 p-6 rounded-xl shadow-xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-red-600">
            Delete File
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Are you sure you want to delete this file permanently? This cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="pt-4 flex justify-end gap-3">
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="h-9 text-sm"
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleDeleteClick}
            className="h-9 text-sm bg-red-600 text-white hover:bg-red-500"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteDialogBox;
