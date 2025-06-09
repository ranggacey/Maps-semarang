"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Player } from "@/components/layout/Player.jsx";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { status } = useSession();

  if (status === "unauthenticated") {
    redirect("/");
  }

  return (
    <div className="h-full">
      <div className="flex h-full pb-[90px]">
        <Sidebar>
          <div className="h-full flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </div>
        </Sidebar>
      </div>
      <Player />
    </div>
  );
} 