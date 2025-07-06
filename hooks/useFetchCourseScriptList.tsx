import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useAccount } from "@/providers/AccountProvider";
import type { MarkedScript } from "@/lib/data";

const fetchCourseScriptList = async (
  token: string,
  courseId: string
): Promise<MarkedScript[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/list/course/${courseId}/`,
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

export const useFetchCourseScriptList = (courseId: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["courseScriptList", courseId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!courseId) throw new Error("No course ID");
      return fetchCourseScriptList(token, courseId);
    },
    enabled: !!token && !!courseId,
  });
};
