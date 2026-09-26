"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PhotoUpload from "@/components/PhotoUpload";

import api from "@/lib/api";
import { posterFormSchema, PosterFormInput } from "@/lib/validations/poster";
import { useAuthStore } from "@/store/authStore";

export default function CreatePosterPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const [loading, setLoading] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PosterFormInput>({
    resolver: zodResolver(posterFormSchema),
    defaultValues: { templateId, photoUrls: [] },
  });

  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !user) {
      toast.error("প্রথমে লগইন করুন");
      router.push("/login");
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated || !user) return null;

  const handlePhotoChange = (urls: string[]) => {
    setPhotoUrls(urls);
    setValue("photoUrls", urls, { shouldValidate: true });
  };

  const onSubmit = async (data: PosterFormInput) => {
    setLoading(true);
    try {
      const res = await api.post("/posters", data);
      toast.success("পোস্টার তৈরি হচ্ছে...");
      router.push(`/posters/${res.data._id || res.data.poster?._id}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "পোস্টার তৈরি ব্যর্থ হয়েছে";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-6xl p-4">
      <Card className="w-sm sm:w-xl md:w-3xl">
        <CardHeader>
          <CardTitle>পোস্টারের তথ্য দিন</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">নাম</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">পদবি</Label>
              <Input id="designation" {...register("designation")} />
              {errors.designation && (
                <p className="text-sm text-destructive">
                  {errors.designation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="party">দল/সংগঠন</Label>
              <Input id="party" {...register("party")} />
              {errors.party && (
                <p className="text-sm text-destructive">
                  {errors.party.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">জেলা/এলাকা</Label>
              <Input id="district" {...register("district")} />
              {errors.district && (
                <p className="text-sm text-destructive">
                  {errors.district.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="headlineText">হেডলাইন টেক্সট</Label>
              <Textarea id="headlineText" {...register("headlineText")} />
              {errors.headlineText && (
                <p className="text-sm text-destructive">
                  {errors.headlineText.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>ছবি আপলোড করুন (সর্বোচ্চ ৩টি)</Label>
              <PhotoUpload photoUrls={photoUrls} onChange={handlePhotoChange} />
              {errors.photoUrls && (
                <p className="text-sm text-destructive">
                  {errors.photoUrls.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "তৈরি হচ্ছে..." : "পোস্টার তৈরি করুন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
