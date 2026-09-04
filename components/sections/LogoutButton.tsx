"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button type="button" onClick={logout}
      className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-4 py-2.5 text-sm font-semibold lift-sm transition-colors hover:bg-chip">
      <LogOut width={16} height={16} strokeWidth={2.5} /> Sign out
    </button>
  );
}
