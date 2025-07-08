import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import type { MarkedScript } from "@/lib/data";

const fetchAssessmentScriptList = async (
  token: string,
  assessmentId: string
): Promise<MarkedScript[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/list/assessment/${assessmentId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch assessment scripts");
  }
  const result = await response.json();
  // Map backend response to MarkedScript type for the UI
  return result.data.map((item: any) => ({
    ...item,
    scriptUploaded: item.file_name,
    studentId: item.student?.student_number,
    courseCode: item.course?.code,
    dateMarked: item.marked_at,
    actions: ["View Script", "approve"], // Add more actions as needed
  }));
};

export const useFetchAssessmentScriptList = (assessmentId?: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["assessmentScriptList", assessmentId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!assessmentId) throw new Error("No assessment ID");
      return fetchAssessmentScriptList(token, assessmentId);
    },
    enabled: !!token && !!assessmentId,
  });
};
