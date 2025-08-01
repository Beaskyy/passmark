"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type ExtractQuestionsPayload = {
  assessment_id: string;
  doc_url: string;
};

export type ExtractQuestionsResponse = {
  status: boolean;
  message: string;
};

const extractQuestions = async (
  token: string,
  payload: ExtractQuestionsPayload
): Promise<ExtractQuestionsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/question/extract-questions/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to extract questions");
  }

  return response.json();
};

export const useExtractQuestions = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: ExtractQuestionsPayload) => {
      if (!token) throw new Error("No access token");
      return extractQuestions(token, payload);
    },
  });
};
