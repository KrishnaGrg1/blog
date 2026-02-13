"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { TrashIcon, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { deleteBlog } from "@/actions/blog.actions";

interface DeleteDialogProps {
  id: string;
  title: string;
  description: string;
  onSuccess?: () => void;
}

export default function DeleteDialog({
  id,
  title,
  description,
  onSuccess,
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteBlog(id);

        toast.success("Blog deleted successfully");
        setOpen(false);

        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-600">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
          <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-zinc-500">
            {description}
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
