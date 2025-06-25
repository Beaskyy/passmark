"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type UpdateQuestionPayload = {
  question_id: string;
  course_id: string;
  assessment_id: string;
  number: string;
  text: string;
  total_marks: number;
  by_ai: boolean;
};

const updateQuestion = async (
  token: string,
  orgId: string,
  payload: UpdateQuestionPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/question/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...payload,
        organisation_id: orgId,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update question");
  }

  return response.json();
};

export const useUpdateQuestion = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: UpdateQuestionPayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return updateQuestion(token, orgId, payload);
    },
  });
};
