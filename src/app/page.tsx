"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import { Template } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const OCCASIONS = [
  { label: "সব", value: "" },
  { label: "বিজয় দিবস", value: "বিজয় দিবস" },
  { label: "শোক/স্মরণ", value: "শোক/স্মরণ" },
  { label: "নির্বাচনী প্রচার", value: "নির্বাচনী প্রচার" },
];

export default function Home() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOccasion, setActiveOccasion] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const query = activeOccasion
          ? `?occasion=${encodeURIComponent(activeOccasion)}`
          : "";
        const res = await api.get(`/templates${query}`);
        setTemplates(res.data);
      } catch {
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [activeOccasion]);

  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-2 text-2xl font-bold">টেমপ্লেট বাছাই করুন</h1>
      <p className="mb-6 text-muted-foreground">
        আপনার প্রয়োজন অনুযায়ী একটি পোস্টার টেমপ্লেট বেছে নিন
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        {OCCASIONS.map((o) => (
          <Badge
            key={o.value}
            variant={activeOccasion === o.value ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setActiveOccasion(o.value)}
          >
            {o.label}
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <p className="text-muted-foreground">কোনো টেমপ্লেট পাওয়া যায়নি</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Link key={t._id} href={`/create/${t._id}`}>
              <Card className="overflow-hidden transition hover:shadow-lg">
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={t.thumbnailUrl}
                    alt={t.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold">{t.title}</h3>
                </CardContent>
                <CardFooter>
                  <Badge variant="secondary">{t.occasionType}</Badge>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
