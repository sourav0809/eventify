"use client";

import React, { useState } from "react";
import { Calendar, LayoutDashboard, Menu, Trello, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LogOutConfirmationDialog from "./dialog/LogOutConfirmationDialog";
import { pathNames } from "@/constant/pathname.const";

interface NavItem {
  icon: React.ReactElement;
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="size-6" />,
    href: pathNames.events,
    label: "Events",
  },
];

const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 sm:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="absolute top-1/2 -translate-y-1/2 left-4 p-2 hover:bg-gray-100 rounded-md transition-colors duration-200"
          aria-label={isMobileOpen ? "Close Menu" : "Open Menu"}
        >
          {isMobileOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed top-0 h-[calc(100dvh-4rem)] sm:h-screen bg-white border-r z-40 group/sidebar flex flex-col",
            // Mobile styles
            "mt-16 sm:mt-0",
            isMobileOpen ? "left-0 w-64" : "-left-full",
            // Desktop styles
            "sm:left-0 sm:w-20 hover:w-64 sm:transition-[width] sm:duration-200"
          )}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-5 my-5">
            <div className="flex items-center text-blue-500">
              <Calendar className="size-8 shrink-0" />
              <span className="ml-3 font-semibold text-xl italic whitespace-nowrap sm:opacity-0 sm:group-hover/sidebar:opacity-100 sm:transition-opacity sm:duration-200">
                Eventify
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-4 space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 640) {
                      setIsMobileOpen(false);
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-md",
                    "transition-colors duration-200",
                    isActive
                      ? "bg-gray-50 text-muted-foreground"
                      : "text-gray-500 hover:bg-gray-100 hover:text-muted-foreground"
                  )}
                >
                  <span className={cn("shrink-0", isActive && "text-blue-500")}>
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap sm:opacity-0 sm:group-hover/sidebar:opacity-100 sm:transition-opacity sm:duration-200">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 pb-6">
            <LogOutConfirmationDialog />
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 sm:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default Sidebar;
