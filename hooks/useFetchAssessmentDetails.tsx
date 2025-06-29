"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

const fetchAssessmentDetails = async (
  token: string,
  orgId: string,
  assessmentId: string
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/assessment/get/${assessmentId}/`,
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
    throw new Error(errorData.message || "Failed to fetch assessment details");
  }

  return response.json();
};

export const useFetchAssessmentDetails = (assessmentId: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["assessmentDetails", assessmentId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      if (!assessmentId) throw new Error("No assessment ID");
      return fetchAssessmentDetails(token, orgId, assessmentId);
    },
    enabled: !!token && !!orgId && !!assessmentId,
  });
};
