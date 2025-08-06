"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type DeleteAssessmentPayload = {
  assessment_id: string;
};

const deleteAssessment = async (
  token: string,
  payload: DeleteAssessmentPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/assessment/delete/`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete assessment");
  }
  return response.json();
};

export const useDeleteAssessment = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: DeleteAssessmentPayload) => {
      if (!token) throw new Error("No access token");
      return deleteAssessment(token, payload);
    },
  });
};
