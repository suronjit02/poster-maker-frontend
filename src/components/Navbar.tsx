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
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <Link
          href="/"
          className="self-center text-xl font-bold tracking-tight sm:self-auto"
        >
          Poster<span className="text-primary">Maker</span>
        </Link>

        <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:justify-end sm:gap-4">
          {user ? (
            <>
              <Link
                href="/posters"
                className="text-sm whitespace-nowrap hover:text-primary"
              >
                আমার পোস্টার
              </Link>

              <span className="max-w-24 truncate text-sm text-muted-foreground sm:max-w-none">
                {user.name}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="whitespace-nowrap"
              >
                লগআউট
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm whitespace-nowrap hover:text-primary"
              >
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
