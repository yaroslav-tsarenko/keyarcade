import type { Metadata } from "next";
import { ResetForm } from "@/components/sections/ResetForm";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return (
    <div className="mx-auto max-w-[460px] px-4 py-14 md:px-6">
      <h1 className="text-stage text-ink">New password</h1>
      <p className="mt-2 text-sm font-semibold text-ink-muted">
        Choose a new password for your account.
      </p>
      <ResetForm token={token ?? ""} />
    </div>
  );
}
