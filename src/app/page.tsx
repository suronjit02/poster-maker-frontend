"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { Template } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          টেমপ্লেট বাছাই করুন
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          আপনার প্রয়োজন অনুযায়ী একটি পোস্টার টেমপ্লেট বেছে নিন
        </p>
      </div>

      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {OCCASIONS.map((o) => (
          <Badge
            key={o.value}
            variant={activeOccasion === o.value ? "default" : "outline"}
            className="cursor-pointer rounded-full px-4 py-3 text-sm transition hover:scale-105"
            onClick={() => setActiveOccasion(o.value)}
          >
            {o.label}
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <p className="text-center text-muted-foreground">
          কোনো টেমপ্লেট পাওয়া যায়নি
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, index) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link href={`/create/${t._id}`} className="group">
                <Card className="overflow-hidden rounded-xl border-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                    <Image
                      src={t.thumbnailUrl}
                      alt={t.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <Badge className="rounded-full">{t.occasionType}</Badge>
                    </div>
                  </div>
                  <CardContent className="px-5 py-4">
                    <h3 className="font-semibold">{t.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
