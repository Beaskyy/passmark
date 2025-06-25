"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type UpdateAssessmentPayload = {
  assessment_id: string;
  course_id: string;
  title: string;
  description: string;
};

const updateAssessment = async (
  token: string,
  payload: UpdateAssessmentPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/assessment/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update assessment");
  }

  return response.json();
};

export const useUpdateAssessment = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: UpdateAssessmentPayload) => {
      if (!token) throw new Error("No access token");
      return updateAssessment(token, payload);
    },
  });
};
