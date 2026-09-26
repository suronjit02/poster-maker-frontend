import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">পেজটি খুঁজে পাওয়া যায়নি</h1>
      <p className="text-muted-foreground">
        আপনি যে পেজটি খুঁজছেন সেটি হয়তো সরানো হয়েছে বা কখনো ছিল না
      </p>
      <Button asChild className="mt-2">
        <Link href="/">হোমপেজে ফিরে যান</Link>
      </Button>
    </div>
  );
}
