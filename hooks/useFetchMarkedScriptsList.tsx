import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Define the type for a single mark item
export interface MarkedScriptMark {
  mark_id: string;
  script_id: string;
  question_id: string;
  question: {
    question_id: string;
    number: string;
    text: string;
    total_marks: number;
    by_ai: boolean;
  };
  awarded_marks: number;
  comment: string;
  extracted_answer: string;
  is_edited: boolean;
  marked_at: string;
}

// Define the response type
export interface MarkedScriptsListResponse {
  status: boolean;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  data: MarkedScriptMark[];
}

const fetchMarkedScriptsList = async (
  token: string,
  assessmentId: string
): Promise<MarkedScriptsListResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/marks/list/${assessmentId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch marked scripts list");
  }
  return response.json();
};

export const useFetchMarkedScriptsList = (assessmentId?: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["markedScriptsList", assessmentId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!assessmentId) throw new Error("No assessment ID");
      return fetchMarkedScriptsList(token, assessmentId);
    },
    enabled: !!token && !!assessmentId,
  });
};
