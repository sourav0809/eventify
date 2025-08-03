"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/common/ui/dialog";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { pathNames } from "@/constant/pathname.const";
import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "../common/ui/button";

const LogOutConfirmationDialog = () => {
  const router = useRouter();
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut();
      router.push(pathNames.login);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 p-2.5 rounded-md w-full cursor-pointer",
            "transition-colors duration-200",
            "text-gray-500 hover:bg-red-50 hover:text-red-600 group/logout"
          )}
        >
          <LogOut className="h-6 w-6 shrink-0" />
          <span className="whitespace-nowrap sm:opacity-0 sm:group-hover/sidebar:opacity-100 sm:transition-opacity sm:duration-200">
            Logout
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold leading-none tracking-tight">
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-3">
            Are you sure you want to logout? You&apos;ll need to sign in again
            to access your dashboard.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-2 mt-6">
          <Button
            onClick={handleLogout}
            disabled={loading}
            className={cn(
              "h-12 w-36 cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-500 text-white font-medium text-sm transition-colors duration-200",
              loading ? "cursor-not-allowed opacity-80" : "hover:bg-blue-600"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging out...
              </span>
            ) : (
              "Logout"
            )}
          </Button>

          <DialogTrigger asChild>
            <Button className="w-36 bg-gray-100 text-black h-12 cursor-pointer inline-flex items-center justify-center px-4 py-2 rounded-md border border-input hover:bg-accent hover:text-accent-foreground font-medium text-sm transition-colors duration-200">
              Cancel
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutConfirmationDialog;
