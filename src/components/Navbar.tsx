"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link href="/" className="text-lg font-semibold">
          Poster Maker
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/posters" className="text-sm">
                আমার পোস্টার
              </Link>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                লগআউট
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">
                লগইন
              </Link>
              <Button size="sm" asChild>
                <Link href="/register">রেজিস্টার</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
