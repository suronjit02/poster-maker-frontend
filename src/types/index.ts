export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Template {
  _id: string;
  title: string;
  occasionType: string;
  thumbnailUrl: string;
  layoutConfig: Record<string, unknown>;
  isActive: boolean;
}

export interface PosterFormData {
  templateId: string;
  name: string;
  designation: string;
  party: string;
  district: string;
  headlineText: string;
  photoUrls: string[];
}

export interface Poster {
  _id: string;
  userId: string;
  templateId: string;
  formData: {
    name: string;
    designation: string;
    party: string;
    district: string;
    headlineText: string;
  };
  uploadedPhotoUrls: string[];
  generatedImageUrl?: string;
  status: "draft" | "generating" | "completed" | "failed";
  createdAt: string;
}