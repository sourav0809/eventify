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
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { pathNames } from "@/constant/pathname.const";
import { useClerk } from "@clerk/nextjs";
const LogOutConfirmationDialog = () => {
  const router = useRouter();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
    router.push(pathNames.login);
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
          <button
            onClick={handleLogout}
            className="inline-flex cursor-pointer items-center justify-center px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 font-medium text-sm"
          >
            Logout
          </button>
          <DialogTrigger asChild>
            <button className="inline-flex cursor-pointer items-center justify-center px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors duration-200 font-medium text-sm">
              Cancel
            </button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutConfirmationDialog;
