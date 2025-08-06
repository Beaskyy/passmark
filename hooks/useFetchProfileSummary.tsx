import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

type StatusBreakdown = {
  in_queue: number;
  pending: number;
  in_review: number;
  completed: number;
};

type Summary = {
  total_students: number;
  total_scripts: number;
  pending_scripts: number;
  completed_scripts: number;
  total_courses: number;
  total_assessments: number;
  total_enrollments: number;
  completion_rate: number;
};

type ProfileSummary = {
  organisation_id: string;
  organisation_name: string;
  summary: Summary;
  status_breakdown: StatusBreakdown;
};

const getProfileSummary = async (
  token: string,
  orgId: string
): Promise<ProfileSummary> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/profile/summary/${orgId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch profile summary");
  }

  const result = await response.json();
  return result.data;
};

export const useFetchProfileSummary = () => {
  const { data: session, status } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["profileSummary", orgId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return getProfileSummary(token, orgId);
    },
    enabled: status !== "loading" && !!token && !!orgId,
  });
};
