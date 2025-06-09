"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Player } from "@/components/layout/Player";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <Sidebar>
        <Header>
          <div className="px-6 py-4 overflow-y-auto h-full">
            {children}
          </div>
        </Header>
      </Sidebar>
      <Player />
    </div>
  );
} 