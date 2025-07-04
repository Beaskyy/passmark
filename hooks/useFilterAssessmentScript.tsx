import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type FilterAssessmentScriptPayload = {
  assessment_id: string;
  status: string;
};

const filterAssessmentScript = async (
  token: string,
  payload: FilterAssessmentScriptPayload
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/main/script/filter/assessment/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to filter assessment scripts");
  }
  return response.json();
};

export const useFilterAssessmentScript = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: async (payload: FilterAssessmentScriptPayload) => {
      if (!token) throw new Error("No access token");
      return filterAssessmentScript(token, payload);
    },
  });
};
