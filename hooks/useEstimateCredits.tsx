import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export type CreditEstimatePayload = {
  pages: number;
  questions: number;
  script_count: number;
};

export type CreditEstimateRequest = {
  token: string;
  payload: CreditEstimatePayload;
};

export type CreditEstimateBreakdown = {
  pages: number;
  words: number;
  questions: number;
  time: number;
  tokens: number;
};

export type CreditEstimateResponse = {
  status: boolean;
  message: string;
  data: {
    estimated_credits: number;
    breakdown: CreditEstimateBreakdown;
  };
};

const estimateCredits = async (
  request: CreditEstimateRequest
): Promise<CreditEstimateResponse> => {
  const { token, payload } = request;
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/credit/estimate-credits/`,
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
    throw new Error("Failed to estimate credits");
  }
  return response.json();
};

export const useEstimateCredits = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  return useMutation({
    mutationFn: (payload: CreditEstimatePayload) => {
      if (!token) throw new Error("No access token");
      return estimateCredits({ token, payload });
    },
  });
};
