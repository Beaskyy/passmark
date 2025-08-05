import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

// Define the type for a single marked script
export interface MarkedScript {
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
export interface MarkedScriptResponse {
  status: boolean;
  message: string;
  data: MarkedScript;
}

const fetchMarkedScript = async (
  token: string,
  scriptId: string
): Promise<MarkedScriptResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/marks/get/${scriptId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch marked script");
  }
  return response.json();
};

export const useFetchMarkedScript = (scriptId?: string) => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useQuery({
    queryKey: ["markedScript", scriptId],
    queryFn: () => {
      if (!token) throw new Error("No access token");
      if (!scriptId) throw new Error("No script ID");
      return fetchMarkedScript(token, scriptId);
    },
    enabled: !!token && !!scriptId,
  });
};
