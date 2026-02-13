"use client";

import { signOut } from "@/actions/auth.actions";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

export default function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut();
      } catch (error) {
        toast.error("Failed to sign out");
      }
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleSignOut}
      disabled={isPending}
      className="cursor-pointer text-red-600 focus:text-red-600"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? "Signing out..." : "Sign Out"}
    </DropdownMenuItem>
  );
}
