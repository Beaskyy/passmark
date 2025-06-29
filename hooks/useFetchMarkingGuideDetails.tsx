"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

const fetchMarkingGuideDetails = async (
  token: string,
  orgId: string,
  guideId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/marking-guide/get/${guideId}/`,
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
    throw new Error(
      errorData.message || "Failed to fetch marking guide details"
    );
  }

  return response.json();
};

export const useFetchMarkingGuideDetails = (guideId: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["markingGuideDetails", guideId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      if (!guideId) throw new Error("No guide ID");
      return fetchMarkingGuideDetails(token, orgId, guideId);
    },
    enabled: !!token && !!orgId && !!guideId,
  });
};
