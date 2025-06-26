"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type CreateBonusPayload = {
  question_id: string;
  description: string;
  mark: number;
  by_ai: boolean;
};

const createBonus = async (
  token: string,
  orgId: string,
  payload: CreateBonusPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/bonus/create/`,
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
    throw new Error(errorData.message || "Failed to create bonus");
  }

  return response.json();
};

export const useCreateBonus = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: CreateBonusPayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return createBonus(token, orgId, payload);
    },
  });
};
