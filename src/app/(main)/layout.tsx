"use client";

import Sidebar from "@/components/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="sm:ml-20 mt-20 sm:mt-0">{children}</div>
    </div>
  );
}
