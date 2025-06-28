"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

const fetchMarkingGuideList = async (
  token: string,
  orgId: string,
  questionId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/marking-guide/list/${questionId}/`,
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
    throw new Error(errorData.message || "Failed to fetch marking guide list");
  }

  return response.json();
};

export const useFetchMarkingGuideList = (questionId: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["markingGuideList", questionId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      if (!questionId) throw new Error("No question ID");
      return fetchMarkingGuideList(token, orgId, questionId);
    },
    enabled: !!token && !!orgId && !!questionId,
  });
};
