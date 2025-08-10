"use client";

import { useMutation } from "@tanstack/react-query";

export type UploadFileResponse = {
  script_url: string;
  script_name: string;
  script_type: string;
  script_size: string;
};

const uploadToCloudinary = async (file: File): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
  );

  // Keep original format by using the original filename extension in public_id
  const fileExtension = file.name.split(".").pop();
  if (fileExtension) {
    formData.append(
      "public_id",
      `documents/${Date.now()}_${file.name.replace(
        `.${fileExtension}`,
        ""
      )}.${fileExtension}`
    );
  }

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "File upload failed");
  }

  const data = await res.json();
  return {
    script_url: data.secure_url,
    script_name: data.original_filename,
    script_type: file.type,
    script_size: file.size.toString(),
  };
};

export const useUploadFile = () => {
  return useMutation({
    mutationFn: uploadToCloudinary,
  });
};
