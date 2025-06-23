"use client"

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

type Assessment = {
  assessment_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

const getAssessments = async (
  token: string,
  orgId: string
): Promise<Assessment[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/assessment/list/${orgId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch assessments");
  }
  const result = await response.json();
  return result.data; // Adjust if your backend wraps the list differently
};

export const useFetchAssessments = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["assessments", orgId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return getAssessments(token, orgId);
    },
    enabled: !!token && !!orgId,
  });
};
