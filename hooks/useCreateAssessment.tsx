"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type CreateAssessmentPayload = {
  course_id: string;
  title: string;
  description: string;
};

const createAssessment = async (
  token: string,
  orgId: string,
  payload: CreateAssessmentPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/assessment/create/`,
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
    throw new Error(errorData.message || "Failed to create assessment");
  }

  return response.json();
};

export const useCreateAssessment = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return createAssessment(token, orgId, payload);
    },
  });
};
