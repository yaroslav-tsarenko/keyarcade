import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Lightweight session probe for the client-side header. Keeps every storefront
// page statically renderable while the header hydrates auth state on mount.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({
    user: {
      firstName: user.first_name,
      balanceEur: user.balance_eur,
    },
  });
}
