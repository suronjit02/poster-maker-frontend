"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Download, RotateCw } from "lucide-react";

import api from "@/lib/api";
import { Poster } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PosterPreviewPage() {
  const params = useParams();
  const posterId = params.id as string;

  const [poster, setPoster] = useState<Poster | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchPoster = useCallback(async () => {
    try {
      const res = await api.get(`/posters/${posterId}`);
      setPoster(res.data);
    } catch {
      toast.error("পোস্টার লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  }, [posterId]);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const res = await api.get(`/posters/${posterId}`);
        if (!ignore) setPoster(res.data);
      } catch {
        if (!ignore) toast.error("পোস্টার লোড করা যায়নি");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();
    return () => {
      ignore = true;
    };
  }, [posterId]);

  useEffect(() => {
    if (poster?.status === "generating") {
      const interval = setInterval(fetchPoster, 3000);
      return () => clearInterval(interval);
    }
  }, [poster?.status, fetchPoster]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await api.post(`/posters/${posterId}/regenerate`);
      toast.success("পোস্টার আবার তৈরি হচ্ছে...");
      fetchPoster();
    } catch {
      toast.error("রিজেনারেট ব্যর্থ হয়েছে");
    } finally {
      setRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!poster) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">পোস্টার পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-xl p-4">
      <Card>
        <CardContent className="p-4">
          {poster.status === "generating" || poster.status === "draft" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">পোস্টার তৈরি হচ্ছে...</p>
            </div>
          ) : poster.status === "failed" ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <p className="text-destructive">পোস্টার তৈরি ব্যর্থ হয়েছে</p>
              <Button onClick={handleRegenerate} disabled={regenerating}>
                <RotateCw className="mr-2 h-4 w-4" />
                আবার চেষ্টা করুন
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
                <Image
                  src={poster.generatedImageUrl!}
                  alt="Generated Poster"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <a
                    href={poster.generatedImageUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    ডাউনলোড
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                >
                  <RotateCw className="mr-2 h-4 w-4" />
                  রিজেনারেট
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
