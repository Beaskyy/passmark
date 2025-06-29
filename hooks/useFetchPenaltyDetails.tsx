"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

const fetchPenaltyDetails = async (
  token: string,
  orgId: string,
  penaltyId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/penalty/get/${penaltyId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch penalty details");
  }

  return response.json();
};

export const useFetchPenaltyDetails = (penaltyId: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["penaltyDetails", penaltyId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      if (!penaltyId) throw new Error("No penalty ID");
      return fetchPenaltyDetails(token, orgId, penaltyId);
    },
    enabled: !!token && !!orgId && !!penaltyId,
  });
};
