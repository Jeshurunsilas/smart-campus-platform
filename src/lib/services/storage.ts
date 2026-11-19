import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "File exceeds the maximum allowed size of 10 MB." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Invalid file type. Only JPEG, PNG, and WEBP photographs are allowed.",
    };
  }

  return { isValid: true };
}

export async function uploadServiceRequestImage(file: File): Promise<string> {
  const validation = validateImageFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  if (!isSupabaseConfigured()) {
    // Demonstration fallback: generate local object URL
    return URL.createObjectURL(file);
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to upload photographs.");
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("service-request-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("service-request-images").getPublicUrl(fileName);

  return publicUrl;
}
