"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type CreateMarkingGuidePayload = {
  question_id: string;
  criteria: string;
  description: string;
  mark: number;
  by_ai: boolean;
};

const createMarkingGuide = async (
  token: string,
  orgId: string,
  payload: CreateMarkingGuidePayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/marking-guide/create/`,
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
    throw new Error(errorData.message || "Failed to create marking guide");
  }

  return response.json();
};

export const useCreateMarkingGuide = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: CreateMarkingGuidePayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return createMarkingGuide(token, orgId, payload);
    },
  });
};
