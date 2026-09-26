"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">কিছু একটা সমস্যা হয়েছে</h1>
      <p className="text-muted-foreground">
        দুঃখিত, পেজটি লোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।
      </p>
      <Button onClick={() => reset()} className="mt-2">
        আবার চেষ্টা করুন
      </Button>
    </div>
  );
}
