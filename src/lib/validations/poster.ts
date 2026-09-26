import { z } from "zod";

export const posterFormSchema = z.object({
  templateId: z.string().min(1),
  name: z.string().min(2, "নাম আবশ্যক"),
  designation: z.string().min(2, "পদবি আবশ্যক"),
  party: z.string().min(2, "দল/সংগঠন আবশ্যক"),
  district: z.string().min(2, "জেলা/এলাকা আবশ্যক"),
  headlineText: z.string().min(2, "হেডলাইন আবশ্যক"),
  photoUrls: z
    .array(z.string())
    .min(1, "কমপক্ষে ১টি ছবি আপলোড করুন")
    .max(3, "সর্বোচ্চ ৩টি ছবি"),
});

export type PosterFormInput = z.infer<typeof posterFormSchema>;