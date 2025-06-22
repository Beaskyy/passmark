import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";

type Course = {
  title: string;
  code: string;
  session: string;
  description?: string;
  course_id: string;
  organisation_id: string;
  department_id: null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

const getCourses = async (token: string, orgId: string): Promise<Course[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/course/list/${orgId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const result = await response.json();
  return result.data;
};

export const useFetchCourses = () => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = user?.organisation?.org_id;

  return useQuery({
    queryKey: ["courses", orgId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return getCourses(token, orgId);
    },
    enabled: !!token && !!orgId,
  });
};
