"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type UpdateMarkingGuidePayload = {
  guide_id: string;
  question_id: string;
  criteria: string;
  description: string;
  mark: number;
  by_ai: boolean;
};

const updateMarkingGuide = async (
  token: string,
  orgId: string,
  payload: UpdateMarkingGuidePayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/marking-guide/update/`,
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
    throw new Error(errorData.message || "Failed to update marking guide");
  }

  return response.json();
};

export const useUpdateMarkingGuide = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: UpdateMarkingGuidePayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return updateMarkingGuide(token, orgId, payload);
    },
  });
};
