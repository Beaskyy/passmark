import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { MarkedScript } from "@/lib/data";

const getScript = async (
  token: string,
  scriptId: string
): Promise<MarkedScript> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/get/${scriptId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch script");
  }
  const result = await response.json();
  return result.data;
};

export const useFetchScript = (scriptId?: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["script", scriptId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!scriptId) throw new Error("No script ID");
      return getScript(token, scriptId);
    },
    enabled: !!token && !!scriptId,
  });
};
