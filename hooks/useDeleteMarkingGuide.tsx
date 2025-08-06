"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

export type DeleteMarkingGuidePayload = {
  guide_id: string;
};

const deleteMarkingGuide = async (
  token: string,
  orgId: string,
  payload: DeleteMarkingGuidePayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/marking-guide/delete/`,
    {
      method: "DELETE",
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
    throw new Error(errorData.message || "Failed to delete marking guide");
  }

  return response.json();
};

export const useDeleteMarkingGuide = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useMutation({
    mutationFn: (payload: DeleteMarkingGuidePayload) => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return deleteMarkingGuide(token, orgId, payload);
    },
  });
};
