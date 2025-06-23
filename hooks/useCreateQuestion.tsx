"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

type CreateQuestionPayload = {
  course_id: string;
  assessment_id: string;
  number: string;
  text: string;
  total_marks: number;
  by_ai: boolean;
};

const createQuestion = async (
  token: string,
  orgId: string,
  payload: CreateQuestionPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/question/create/`,
    {
      method: "POST",
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
    throw new Error(errorData.message || "Failed to create question");
  }

  return response.json();
};

export const useCreateQuestion = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return createQuestion(token, orgId, payload);
    },
  });
};
