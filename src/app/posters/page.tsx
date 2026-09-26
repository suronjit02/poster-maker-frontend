"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

import api from "@/lib/api";
import { Poster } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_LABEL: Record<string, string> = {
  draft: "খসড়া",
  generating: "তৈরি হচ্ছে",
  completed: "সম্পন্ন",
  failed: "ব্যর্থ",
};

export default function PosterHistoryPage() {
  const { user } = useAuthStore();
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosters = useCallback(async () => {
    if (!user) return;
    try {
      const res = await api.get(`/posters/user/${user.id}`);
      setPosters(res.data);
    } catch {
      toast.error("পোস্টার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/posters/user/${user.id}`);
        if (!ignore) setPosters(res.data);
      } catch {
        if (!ignore) toast.error("পোস্টার লিস্ট লোড করা যায়নি");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/posters/${id}`);
      setPosters((prev) => prev.filter((p) => p._id !== id));
      toast.success("পোস্টার মুছে ফেলা হয়েছে");
    } catch {
      toast.error("মুছতে ব্যর্থ হয়েছে");
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">লগইন করুন প্রথমে</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">আমার পোস্টার</h1>

      {loading ? (
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-72 w-full rounded-xl" />
          ))}
        </div>
      ) : posters.length === 0 ? (
        <p className="text-muted-foreground">এখনো কোনো পোস্টার তৈরি করেননি</p>
      ) : (
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {posters.map((p) => (
            <Card
              key={p._id}
              className="overflow-hidden rounded-xl border-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Link href={`/posters/${p._id}`}>
                <div className="relative aspect-[4/5] w-full bg-muted">
                  {p.generatedImageUrl ? (
                    <Image
                      src={p.generatedImageUrl}
                      alt={p.formData.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      {p.status === "generating" && (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </Link>
              <CardContent className="px-4 py-3">
                <p className="truncate text-sm font-medium">
                  {p.formData.name}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <Badge
                    variant={p.status === "completed" ? "default" : "secondary"}
                    className="rounded-full"
                  >
                    {STATUS_LABEL[p.status]}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
