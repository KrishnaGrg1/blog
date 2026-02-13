"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteAccountButton({ userId }: { userId: string }) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete account");

      toast.success("Account deleted successfully");
      router.push("/sign-in");
    } catch (error) {
      toast.error("Failed to delete account");
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              This action cannot be undone. This will permanently delete your
              account and remove all your data from our servers, including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>All your blog posts</li>
              <li>Your profile information</li>
              <li>All associated data</li>
            </ul>
            <div className="pt-4">
              <Label htmlFor="confirm">
                Type <strong>DELETE</strong> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-2"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== "DELETE"}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
