import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";
import type { MarkedScript } from "@/lib/data";

const fetchCourseScriptList = async (
  token: string,
  organisationId: string
): Promise<MarkedScript[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/list/course/${organisationId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch course scripts");
  }
  const result = await response.json();
  return result.data; // Adjust if your backend wraps the list differently
};

export const useFetchCourseScriptList = (organisationId?: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = organisationId || user?.organisation?.org_id;

  return useQuery({
    queryKey: ["courseScriptList", orgId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return fetchCourseScriptList(token, orgId);
    },
    enabled: !!token && !!orgId,
  });
};
