import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

// Define the request payload type
export interface UpdateMarkPayload {
  mark_id: string;
  mark: number;
}

// Define the response data type
export interface UpdatedMarkData {
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
export interface UpdateMarkResponse {
  status: boolean;
  message: string;
  data: UpdatedMarkData;
}

const updateMark = async (
  token: string,
  payload: UpdateMarkPayload
): Promise<UpdateMarkResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/marks/update/`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update mark");
  }

  return response.json();
};

export const useUpdateMark = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: UpdateMarkPayload) => {
      if (!token) throw new Error("No access token");
      return updateMark(token, payload);
    },
    onSuccess: (data, variables) => {
      toast.success("Mark updated successfully");

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({
        queryKey: ["markedScriptsList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["markedScript"],
      });
      queryClient.invalidateQueries({
        queryKey: ["scripts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["script"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update mark");
    },
  });
};
