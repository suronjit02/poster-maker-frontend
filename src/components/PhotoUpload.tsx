"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { X, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface PhotoUploadProps {
  photoUrls: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function PhotoUpload({
  photoUrls,
  onChange,
  maxFiles = 3,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (photoUrls.length + acceptedFiles.length > maxFiles) {
        toast.error(`সর্বোচ্চ ${maxFiles}টি ছবি আপলোড করা যাবে`);
        return;
      }

      setUploading(true);
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("photo", file);
          const res = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          return res.data.url;
        });

        const newUrls = await Promise.all(uploadPromises);
        onChange([...photoUrls, ...newUrls]);
        toast.success("ছবি আপলোড সফল হয়েছে");
      } catch {
        toast.error("ছবি আপলোড ব্যর্থ হয়েছে");
      } finally {
        setUploading(false);
      }
    },
    [photoUrls, onChange, maxFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    disabled: uploading || photoUrls.length >= maxFiles,
  });

  const removePhoto = (index: number) => {
    onChange(photoUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {photoUrls.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition ${
            isDragActive ? "border-primary bg-primary/5" : "border-muted"
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                ছবি ড্র্যাগ করুন অথবা ক্লিক করে বাছাই করুন
              </p>
            </>
          )}
        </div>
      )}

      {photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {photoUrls.map((url, i) => (
            <div key={url} className="relative h-24 w-24">
              <Image
                src={url}
                alt={`photo-${i}`}
                fill
                sizes="96px"
                className="rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
