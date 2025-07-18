import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";
import type { MarkedScript } from "@/lib/data";

const fetchOrganisationScriptList = async (
  token: string,
  organisationId: string
): Promise<MarkedScript[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/list/organisation/${organisationId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch organisation scripts");
  }
  const result = await response.json();
  return result.data; // Adjust if your backend wraps the list differently
};

export const useFetchOrganisationScriptList = (organisationId?: string) => {
  const { data: session } = useSession();
  const { user } = useAccount();
  const token = session?.accessToken;
  const orgId = organisationId || user?.organisation?.org_id;

  return useQuery({
    queryKey: ["organisationScriptList", orgId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!orgId) throw new Error("No organisation ID");
      return fetchOrganisationScriptList(token, orgId);
    },
    enabled: !!token && !!orgId,
  });
};
