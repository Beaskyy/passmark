"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

const fetchBonusDetails = async (
  token: string,
  orgId: string,
  bonusId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/bonus/get/${bonusId}/`,
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
    throw new Error(errorData.message || "Failed to fetch bonus details");
  }

  return response.json();
};

export const useFetchBonusDetails = (bonusId: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["bonusDetails", bonusId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      if (!bonusId) throw new Error("No bonus ID");
      return fetchBonusDetails(token, orgId, bonusId);
    },
    enabled: !!token && !!orgId && !!bonusId,
  });
};
