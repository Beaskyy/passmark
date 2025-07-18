"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type Assessment = {
  assessment_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

const fetchAssessmentList = async (
  token: string,
  assessmentId: string
): Promise<Assessment[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/assessment/list/${assessmentId}`,
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

export const useFetchAssessmentList = (assessmentId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["assessmentList", assessmentId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!assessmentId) throw new Error("No assessment ID");
      return fetchAssessmentList(token, assessmentId);
    },
    enabled: !!token && !!assessmentId,
  });
};
